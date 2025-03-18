import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDto } from './email.dto';
import { recived } from './templates/recived';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  async sendMail(@Body() sendEmailDto: SendEmailDto) {
    console.log(sendEmailDto);
    await this.mailService.sendEmail(
      [
        {
          email: sendEmailDto.email,
          name: sendEmailDto.name,
        },
      ],
      `Urbano Soporte - ${sendEmailDto.name}`,
      sendEmailDto.message,
      recived(sendEmailDto.name, sendEmailDto.message),
    );
    return { message: 'Email enviado' };
  }
}
