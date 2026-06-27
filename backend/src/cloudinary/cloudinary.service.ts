import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Photos } from 'src/venues/photos.model';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<Photos> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'book-my-venue',
          },
          (error, result) => {
            if (error) {
                return reject(new ServiceUnavailableException("Image upload failed"))
            }

            resolve({url: result!.secure_url, publicId: result!.public_id});
          },
        )
        .end(file.buffer);
    });
  }

    async deleteImage(publicId: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {

            if (error) {
                return reject(new ServiceUnavailableException("Image deletion failed"));
            }

            if (result.result === 'not found') {
                return reject(new NotFoundException("Image not found on storage provider"));
            }

            resolve(result);
            });
        });
    }
}