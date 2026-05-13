import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { NestjsRabbitmqController } from './nestjs-rabbitmq.controller';
import { NestjsRabbitmqService } from './nestjs-rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'example.exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://admin:admin123@192.168.124.101:5672',
      defaultPublishOptions: {
        persistent: true,
      },
      connectionInitOptions: {
        wait: false,
      },
    }),
  ],
  controllers: [NestjsRabbitmqController],
  providers: [NestjsRabbitmqService],
})
export class NestjsRabbitmqModule {}
