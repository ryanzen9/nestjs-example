import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class LoginService {
  transporter: Transporter;

  private verificationCodes: Map<string, string> = new Map();

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_TOKEN,
      },
    });
  }

  private async sendEmail(
    from: string,
    to: string,
    subject: string,
    text: string,
  ) {
    return this.transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
  }

  async sendVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(email, code);
    await this.sendEmail(
      'rubyceng@qq.com',
      email,
      'Your Verification Code',
      `Your verification code is: ${code}`,
    );
  }

  verifyCode(email: string, code: string): boolean {
    const storedCode = this.verificationCodes.get(email);
    if (storedCode === code) {
      this.verificationCodes.delete(email);
      return true;
    }
    return false;
  }
}
