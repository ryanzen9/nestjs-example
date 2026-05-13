import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get } from '@nestjs/common';

@Controller('nestjs-rabbitmq')
export class NestjsRabbitmqController {
  constructor(public readonly amqp: AmqpConnection) {}

  @Get()
  getHello() {
    return this.amqp.publish('example.exchange', 'example.test', {
      message: 'Hello, World!',
    });
  }
}
