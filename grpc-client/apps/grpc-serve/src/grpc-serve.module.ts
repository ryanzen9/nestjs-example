import { Module } from '@nestjs/common';
import { GrpcServeController } from './grpc-serve.controller';
import { GrpcServeService } from './grpc-serve.service';

@Module({
  imports: [],
  controllers: [GrpcServeController],
  providers: [GrpcServeService],
})
export class GrpcServeModule {}
