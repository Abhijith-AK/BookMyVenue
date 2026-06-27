import { ConfigService } from '@nestjs/config';
import { Photos } from "../venues/photos.model";
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<Photos>;
    deleteImage(publicId: string): Promise<{
        result: string;
    }>;
}
