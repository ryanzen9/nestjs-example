import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('async')
  async(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.async(createProducerDto);
  }

  @Post('sync')
  sync() {
    return this.producerService.sync();
  }
}
