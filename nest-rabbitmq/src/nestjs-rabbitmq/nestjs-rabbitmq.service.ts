import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

type MqMessage = {
  message: string;
};

@Injectable()
export class NestjsRabbitmqService {
  @RabbitSubscribe({
    exchange: 'example.exchange',
    routingKey: 'example.test',
    queue: 'example.test.queue',
    queueOptions: {
      durable: true,
      deadLetterExchange: 'example.dlx.exchange',
      deadLetterRoutingKey: 'example.test.dlq',
    },
  })
  interceptedMessage(@RabbitPayload() message: MqMessage) {
    console.log('Received message', message);
  }
}
