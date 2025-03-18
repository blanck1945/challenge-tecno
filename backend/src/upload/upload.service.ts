import { Injectable } from '@nestjs/common';
import { base, BaseResponse } from '@uploadcare/upload-client';

@Injectable()
export class UploadService {
  async uploadFile(file: Buffer): Promise<BaseResponse> {
    const result = await base(file, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
      store: 'auto',
      metadata: {
        subsystem: 'uploader',
        pet: 'cat',
      },
    });

    return result;
  }
}
