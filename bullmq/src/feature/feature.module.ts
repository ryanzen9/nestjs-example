import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureProcessor } from './feature.processor';
import { FeatureService } from './feature.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'feature',
    }),
    BullBoardModule.forFeature({
      name: 'feature',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureProcessor],
})
export class FeatureModule {}
