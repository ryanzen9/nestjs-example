import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. 挂载 RabbitMQ 微服务监听
  app.connectMicroservice<MicroserviceOptions>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:secret123@10.0.5.134:5672'],
      queue: 'nest_rabbitmq_example_queue',
      queueOptions: {
        durable: true, // 队列持久化
      },
      noAck: false,
      prefetchCount: 1, // 每次只处理一条消息，防止雪崩
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
