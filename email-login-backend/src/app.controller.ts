import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginService } from './login/login.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loginService: LoginService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send-code')
  async sendCode(): Promise<string> {
    const email = 'rubyceng0326@gmail.com';
    await this.loginService.sendVerificationCode(email);
    return 'success';
  }

  @Get('verify-code/:code')
  verifyCode(@Param('code') code: string): string {
    const email = 'rubyceng0326@gmail.com';
    const isValid = this.loginService.verifyCode(email, code);
    return isValid ? 'Verification successful' : 'Verification failed';
  }
}
