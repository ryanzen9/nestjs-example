import { Test, TestingModule } from '@nestjs/testing';
import { GrpcServeController } from './grpc-serve.controller';
import { GrpcServeService } from './grpc-serve.service';

describe('GrpcServeController', () => {
  let grpcServeController: GrpcServeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GrpcServeController],
      providers: [GrpcServeService],
    }).compile();

    grpcServeController = app.get<GrpcServeController>(GrpcServeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(grpcServeController.getHello()).toBe('Hello World!');
    });
  });
});
