import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcServeService } from './grpc-serve.service';

@Controller()
export class GrpcServeController {
  constructor(private readonly grpcServeService: GrpcServeService) {}

  @Get()
  getHello(): string {
    return this.grpcServeService.getHello();
  }

  @GrpcMethod('BookService', 'FindBook')
  findBook(data: { id: number }) {
    const items = [
      { id: 1, name: '前端调试通关秘籍', desc: '网页和 node 调试' },
      { id: 2, name: 'Nest 通关秘籍', desc: 'Nest 和各种后端中间件' },
    ];
    return items.find(({ id }) => id === data.id);
  }
}
