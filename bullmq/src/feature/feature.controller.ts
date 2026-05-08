import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { FeatureService } from './feature.service';

@Controller('feature')
export class FeatureController {
  constructor(
    private readonly featureService: FeatureService,
    @InjectQueue('feature') private readonly queue: Queue,
  ) {}

  @Post()
  async addToQueue(@Body() data: any) {
    // 把任务加入队列，让它被 Worker 消费
    await this.queue.add('call-third-party', data, {
      attempts: 3, // 失败后最多重试3次
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100, // 完成后保留最近100条，方便查看
      removeOnFail: false, // 失败的任务不自动删除，用于人工重试
    });
    return { message: '任务已提交' };
  }
}
