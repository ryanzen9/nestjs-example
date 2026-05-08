import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: '10.0.5.134',
        port: 6380,
        password: 'redis_dev',
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
      //   middleware: expressBasicAuth({
      //     users: { admin: 'password' },
      //     challenge: true,
      //   }),
    }),
    FeatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
