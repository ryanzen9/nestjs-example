import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcServeModule } from './grpc-serve.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(
    GrpcServeModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:8000',
        package: 'book',
        protoPath: join(__dirname, 'protos/book.proto'),
      },
    },
  );
  await app.listen();
}

bootstrap();
