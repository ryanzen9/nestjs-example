import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get } from '@nestjs/common';

@Controller('nestjs-rabbitmq')
export class NestjsRabbitmqController {
  constructor(public readonly amqp: AmqpConnection) {}

  @Get()
  async getHello() {
    const data = await this.amqp.request({
      payload: { message: 'Hello, RPC!' },
      exchange: 'example.exchange',
      routingKey: 'example.rpc',
      timeout: 5000,
    });
    console.log('RPC Response:', data);
    return this.amqp.publish('example.exchange', 'example.publish', {
      message: 'Hello, World!',
    });
  }
}
