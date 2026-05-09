import { Inject, Injectable } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProducerService {
  @Inject('INVENTORY_SERVICE')
  private readonly client: ClientProxy;

  async(createProducerDto: CreateProducerDto) {
    // 异步调用，无需等待返回结果
    return this.client.emit('productCreate', {
      createProducerDto,
      timestamp: new Date(),
    });
  }

  async sync() {
    // send() 返回的是 Observable，通常用 firstValueFrom 转成 Promise
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await firstValueFrom(
      this.client.send({ cmd: 'check_inventory' }, { timestamp: new Date() }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }
}
