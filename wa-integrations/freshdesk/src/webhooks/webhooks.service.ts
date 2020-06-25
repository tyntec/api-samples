import { Injectable } from '@nestjs/common';
import * as axios from 'axios';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

@Injectable()
export class WebhooksService {
  async sendWhatsAppMessage(
    customerPhone: string,
    customerName: string,
    templateParams: string[],
  ): Promise<{ status: number; message: string; messageId: string }> {
    // send a WhatsApp message to the customer
    const responseWA = await this.sendWhatsAppTemplate(
      customerPhone,
      templateParams
    );

    // create a new ticket
    const responseFD = await axios.default.post(
      `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets`,
      {
        description: `An appointment was confirmed: ${templateParams}`,
        subject: `Appointment confirmation on WhatsApp`,
        name: customerName,
        phone: customerPhone,
        priority: 1,
        status: 2
      },
      {
        auth: {
          username: process.env.FRESHDESK_API_KEY,
          password: 'X',
        },
      },
    );
    Logger.log('Ticket created: #' + responseFD.data.id)

    return {
      status: 200,
      message: 'WhatsApp Message Sent!',
      messageId: responseWA.data.messageId,
    };
  }

  async updateTicketOnResponse(text: string, from: string): Promise<void> {
    // get all the tickets
    const result = await axios.default.get(
      `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets?include=requester`,
      {
        auth: {
          username: process.env.FRESHDESK_API_KEY,
          password: 'X',
        },
      },
    );

    // add notes to the latest ticket
    for (const ticket of result.data) {
      if (ticket.requester.phone.includes(from)) {
        // Logger.log('Ticket: ' + ticket.id)
        await axios.default.post(
          `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets/${ticket.id}/notes`,
          {
            body: text,
          },
          {
            auth: {
              username: process.env.FRESHDESK_API_KEY,
              password: 'X',
            },
          },
        );
        break;
      }
    }
    return;
  }

  async notifyCustomerOnTicketChanges(
    publicNote: string,
    phone: string
  ): Promise<{ messageId: string }> {
    // parse public note (html to text)
    const arr = publicNote.split(':');
    arr.shift();
    const parsedPublicNote = arr.join('').replace(/<[^>]+>/g, '');

    // send a text message to the customer when the ticket is updated by agents
    const result = await this.sendWhatsAppFreeText(
      phone,
      parsedPublicNote
    );
    return { messageId: result.data };
  }

  // generic function for sending template WA messages
  private async sendWhatsAppTemplate(
    customerPhone: string,
    parameters: string[],
  ): Promise<axios.AxiosResponse<any>> {
    const baseUrl = 'https://api.tyntec.com/chat-api/v2';
    const componentParameterData = [];

    if (parameters) {
      for (const parameter of parameters) {
        componentParameterData.push({
          text: parameter,
          type: 'text',
        });
      }
    }

    const data: WhatsAppData = {
      to: customerPhone,
      channels: ['whatsapp'],
      whatsapp: {
        from: process.env.WABA_NUMBER,
        contentType: 'template',
        template: {
          language: {
            code: 'en',
          },
          templateId: 'appointment_confirmation',
          components: [
            {
              parameters: componentParameterData,
              type: 'body',
            },
          ],
        },
      },
    };

    return await axios.default.post(`${baseUrl}/messages`, data, {
      headers: {
        apikey: process.env.TYNTEC_API_KEY,
      },
    });
  }

  // generic function to send freetext WA messages
  private async sendWhatsAppFreeText(
    customerPhone: string,
    publicNote: string,
  ) {
    const baseUrl = 'https://api.tyntec.com/chat-api/v2';

    const data = {
      to: customerPhone,
      channels: ['whatsapp'],
      whatsapp: {
        from: process.env.WABA_NUMBER,
        text: publicNote,
        contentType: 'text',
      },
    };

    return await axios.default.post(`${baseUrl}/messages`, data, {
      headers: {
        apikey: process.env.TYNTEC_API_KEY,
      },
    });
  }
}

// interface of the specific WA schema
interface WhatsAppData {
  to: string;
  channels: string[];
  whatsapp: {
    from: string;
    contentType: string;
    template: {
      language: {
        code: string;
      };
      templateId: string;
      components: [
        {
          parameters: {
            text: string;
            type: string;
          }[];
          type: string;
        },
      ];
    };
  };
}
