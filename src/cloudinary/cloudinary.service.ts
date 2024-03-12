import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier'; // Import streamifier library

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      // Use streamifier as a function to create a readable stream from the file buffer
      const readableStream = streamifier.createReadStream(file.buffer);

      readableStream.pipe(upload); // Pipe the file data into the upload stream
    });
  }
}
