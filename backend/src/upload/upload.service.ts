import { BadRequestException, Injectable } from '@nestjs/common';
import { base, BaseResponse } from '@uploadcare/upload-client';

@Injectable()
export class UploadService {
  async uploadFile(file: Buffer): Promise<BaseResponse> {
    try {
      const result = await base(file, {
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
        store: 'auto',
        metadata: {
          subsystem: 'uploader',
          pet: 'cat',
        },
      });

      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
