import {
  RabbitPayload,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

type MqMessage = {
  message: string;
};

@Injectable()
export class NestjsRabbitmqService {
  @RabbitSubscribe({
    exchange: 'example.exchange',
    routingKey: 'example.publish',
    queue: 'example.publish.queue',
    queueOptions: {
      durable: true,
      deadLetterExchange: 'example.dlx.exchange',
      deadLetterRoutingKey: 'example.publish.dlq',
    },
  })
  interceptedMessage(@RabbitPayload() message: MqMessage) {
    // 模拟错误
    // throw new Error('Simulated processing error');
    console.log('Received message', message);
  }

  @RabbitRPC({
    exchange: 'example.exchange',
    routingKey: 'example.rpc',
    queue: 'example.rpc.queue',
    queueOptions: {
      durable: true,
      deadLetterExchange: 'example.dlx.exchange',
      deadLetterRoutingKey: 'example.rpc.dlq',
    },
  })
  handleRpc(@RabbitPayload() message: MqMessage) {
    return { response: `Received RPC message: ${message.message}` };
  }
}
