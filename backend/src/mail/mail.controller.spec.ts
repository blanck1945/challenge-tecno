import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { SendEmailDto } from './email.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('MailController', () => {
  let controller: MailController;
  let mailService: MailService;

  const mockMailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send an email successfully', async () => {
      const emailDto: SendEmailDto = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      };

      const expectedResponse = { message: 'Email sent successfully' };
      mockMailService.sendEmail.mockResolvedValue(expectedResponse);

      const result = await controller.sendMail(emailDto);

      expect(result).toEqual(expectedResponse);
      expect(mailService.sendEmail).toHaveBeenCalledWith(emailDto);
      expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when email service fails', async () => {
      const emailDto: SendEmailDto = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      };

      const error = new Error('Failed to send email');
      mockMailService.sendEmail.mockRejectedValue(error);

      await expect(controller.sendMail(emailDto)).rejects.toThrow(error);
      expect(mailService.sendEmail).toHaveBeenCalledWith(emailDto);
    });
  });
});
