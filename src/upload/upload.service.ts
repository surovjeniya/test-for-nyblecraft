import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

interface UploadServiceResponse {
  url: string;
  name: string;
}

@Injectable()
export class UploadService {
  async saveFile(
    file: Express.Multer.File | any,
    folder: string,
  ): Promise<UploadServiceResponse> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
    return {
      url: `/uploads/${folder}/${file.originalname}`,
      name: file.originalname,
    };
  }
}
