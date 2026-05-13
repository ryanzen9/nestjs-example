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
      uri: 'amqp://admin:secret123@10.0.5.134:5672',
      defaultPublishOptions: {
        persistent: true,
      },
      connectionInitOptions: {
        wait: true,
      },
    }),
  ],
  controllers: [NestjsRabbitmqController],
  providers: [NestjsRabbitmqService],
})
export class NestjsRabbitmqModule {}
