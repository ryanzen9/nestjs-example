import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('feature')
export class FeatureProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    // 模拟调用第三方接口
    // 这里可以放实际的调用逻辑，比如使用 axios 发送 HTTP 请求
    const data = await this.getPromissed(job);
    console.log(`Processing job ${job.id} with data:`, data);
    return data;
  }

  getPromissed(job?: Job): Promise<string> {
    throw new Error('Method not implemented.');
    return Promise.resolve(`Processing job ${job?.id} with data:`);
  }
}
