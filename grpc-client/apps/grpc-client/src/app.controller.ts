import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';

interface FindById {
  id: number;
}
interface Book {
  id: number;
  name: string;
  desc: string;
}
interface BookService {
  findBook(param: FindById): Book;
}

@Controller()
export class AppController {
  @Inject('BOOK_PACKAGE')
  private readonly client: ClientGrpc;

  private bookService: BookService;

  onModuleInit() {
    this.bookService = this.client.getService<BookService>('BookService');
  }

  @Get(':id')
  findBookById(@Param('id') id: number) {
    return this.bookService.findBook({ id });
  }
}
