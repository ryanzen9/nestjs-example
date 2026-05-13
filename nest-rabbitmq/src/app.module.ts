import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestjsRabbitmqModule } from './nestjs-rabbitmq/nestjs-rabbitmq.module';

@Module({
  //   imports: [ProducerModule, ConsumerModule, NestjsRabbitmqModule],
  imports: [NestjsRabbitmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
