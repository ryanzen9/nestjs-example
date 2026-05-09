/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment*/
import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('productCreate')
  handleProductCreate(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('接收到异步事件:', data);

      // 你的业务逻辑：调用 CommandHandler 等

      // 模拟错误
      throw new Error('模拟处理失败');

      // 成功处理，手动确认
      channel.ack(originalMsg);
    } catch (error) {
      console.error('处理失败，将消息重新放回队列', error);
      // 失败直接放到 死信队列，第三个参数 false 表示不批量拒绝，第二个参数 false 表示不重新入队
      channel.nack(originalMsg, false, false);
    }
  }

  @MessagePattern({ cmd: 'check_inventory' })
  handleCheckInventory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel: any = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('收到同步 RPC 请求:', data);
      const isAvailable = true; // 模拟查询库存

      throw new Error('模拟查询失败'); // 模拟查询失败

      channel.ack(originalMsg);
      // 返回的值会自动通过 RabbitMQ 回传给发送方
      return { available: isAvailable, stock: 100 };
    } catch (error) {
      channel.nack(originalMsg, false, false);
      throw error; // 将错误抛回给调用方
    }
  }
}
