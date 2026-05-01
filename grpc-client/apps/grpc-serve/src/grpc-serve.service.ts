import { Injectable } from '@nestjs/common';

@Injectable()
export class GrpcServeService {
  getHello(): string {
    return 'Hello World!';
  }
}
