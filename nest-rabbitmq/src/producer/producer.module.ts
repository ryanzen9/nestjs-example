import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_SERVICE', // 注入的 Token
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:secret123@10.0.5.134:5672'],
          queue: 'nest_rabbitmq_example_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
