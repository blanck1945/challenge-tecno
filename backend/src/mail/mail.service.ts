// @ts-nocheck
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailtrapClient, MailtrapTransport } from 'mailtrap';
import * as mailjet from 'node-mailjet';
import { SendEmailDto } from './email.dto';
import { recived } from './templates/recived';

@Injectable()
export class MailService {
  private mailjet;

  constructor() {
    this.mailjet = mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC || 'mock',
      process.env.MJ_APIKEY_PRIVATE || 'mock',
    );
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'aspastrana990@gmail.com',
              Name: 'Urbano Soporte',
            },
            To: [
              {
                Email: sendEmailDto.email,
                Name: sendEmailDto.name,
              },
            ],
            Subject: `Urbano Soporte - ${sendEmailDto.name}`,
            TextPart: sendEmailDto?.message || 'No hay mensaje',
            HTMLPart: recived(sendEmailDto.name, sendEmailDto.message),
          },
        ],
      });

      return { message: 'Email enviado' };
    } catch (error) {
      throw new HttpException('Error al enviar correo', HttpStatus.BAD_REQUEST);
    }
  }
}
