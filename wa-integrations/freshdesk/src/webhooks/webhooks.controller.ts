/* eslint-disable @typescript-eslint/camelcase */
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { InitConversationDto } from './dto/initConversation.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/initConversation')
  webhookOne(
    @Body(ValidationPipe) dto: InitConversationDto,
  ): Promise<{ status: number; message: string; messageId: string }> {
    const { customerPhone, customerName, templateParams } = dto;
    return this.webhooksService.sendWhatsAppMessage(customerPhone, customerName, templateParams);
  }

  @Post('/receiveResponse')
  webhookTwo(@Body() dto: any): Promise<void> {
    const { content, from } = dto;
    if (!content || !from) {
      throw new BadRequestException('No text message found!');
    }
    return this.webhooksService.updateTicketOnResponse(content.text, from);
  }

  @Post('/sendResponse')
  webhookThree(@Body() dto: any): Promise<{ messageId: string }> {
    const { freshdesk_webhook } = dto;
    return this.webhooksService.notifyCustomerOnTicketChanges(
      freshdesk_webhook.ticket_latest_public_comment,
      freshdesk_webhook.ticket_contact_phone
    );
  }
}
