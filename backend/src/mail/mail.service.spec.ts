import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as mailjet from 'node-mailjet';

jest.mock('node-mailjet', () => ({
  apiConnect: jest.fn(() => ({
    post: jest.fn().mockReturnThis(),
    request: jest.fn(),
  })),
}));

describe('MailService', () => {
  let service: MailService;
  let mockMailjetClient;

  beforeEach(async () => {
    jest.clearAllMocks();

    // @ts-ignore - Ignoramos el error de tipos para el mock
    mockMailjetClient = (mailjet.apiConnect as jest.Mock)();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
