// @ts-nocheck
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailtrapClient, MailtrapTransport } from 'mailtrap';
import * as mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  private mailjet;

  constructor() {
    this.mailjet = mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE,
    );
  }

  async sendEmail(to: any, subject: string, text: string, html: string) {
    try {
      const request = this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'aspastrana990@gmail.com', // Tu dirección de correo
              Name: 'Urbano Soporte', // Nombre del remitente
            },
            To: [
              {
                Email: to[0].email, // Dirección de correo del destinatario
                Name: to[0].name, // Nombre del destinatario
              },
            ],
            Subject: subject, // Asunto del correo
            TextPart: text, // Texto plano
            HTMLPart: html, // Parte HTML del correo
          },
        ],
      });

      const result = await request;
      return result.body;
    } catch (error) {
      console.error('Error al enviar correo:', error.statusCode, error.message);
      throw new Error('Error al enviar correo');
    }
  }
}
