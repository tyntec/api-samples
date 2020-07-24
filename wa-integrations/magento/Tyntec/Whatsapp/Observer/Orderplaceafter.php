<?php

namespace Tyntec\Whatsapp\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Dotenv\Dotenv;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Log\LoggerInterface;


class Orderplaceafter implements ObserverInterface
{
  protected $logger;
  protected $client;
  protected $request;

  public function __construct(LoggerInterface $logger)
  {
    $this->logger = $logger;
    try {
      $this->client = new Client();
      $this->request = new Request('POST', 'https://api.tyntec.com/chat-api/v2/messages');
      $this->logger->debug('tyntec Observer: instantiated');
    } catch (Throwable $e) {
      $this->logger->debug('tyntec Observer: error in constructor: ', $e->getMessage(), "\n");
    }
  }


  public function execute(Observer $observer)
  {
    try {
      $dotenv = new Dotenv(__DIR__);
      $dotenv->load();
      $dotenv->required(['TYNTEC_API_KEY', 'WABA_NUMBER']);
      $options = [
        'headers' => [
          'apikey' => $_ENV['TYNTEC_API_KEY'],
          'Content-Type' => 'application/json'
        ]
      ];
      // Query order data from the event
      $order = $observer->getEvent()->getOrder();
      $orderNumber = $order->getIncrementId();
      //$total = $order->getGrandTotal();
      // Assuming that the user has entered a phone number in the international format
      $phone = $order->getBillingAddress()->getTelephone();

      $this->logger->debug('tyntec: Observing order no.'.$orderNumber.' with phone '.$phone);

      // Template message json body -- use your own template!
      $options['json'] = [
        'to' => $phone,
        'channels' => [0 => 'whatsapp'],
        'whatsapp' => [
          'from' => $_ENV['WABA_NUMBER'],
          'contentType' => 'template',
          'template' => [
            'templateId' => 'account_verification',
            'language' => ['code' => 'en'],
            'components' => [
              ['type' => 'body',
              'parameters' => [
                ['type'=>'text', 'text'=>'order'],
                ['type'=>'text', 'text'=>$orderNumber]
              ]]
            ]
          ]
        ]
      ];

      // Execute the request
      $res = $this->client->send($this->request, $options);
      $this->logger->debug('tyntec Observer: response status: '.$res->getStatusCode().' '.$res->getReasonPhrase());
    } catch (Throwable $e) {
      $this->logger->debug('tyntec Observer: error in executor: ', $e->getMessage(), "\n");
    }
  }
}
?>
