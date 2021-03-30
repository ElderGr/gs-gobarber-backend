import IStorageProvider from "../models/IStorageProvider";
import fs from "fs";
import path from "path";
import aws, {S3} from 'aws-sdk';
import uploadConfig from '@config/upload';
import mime from 'mime';

export default class DiskStorageProvider implements IStorageProvider{
    private client: S3

    constructor(){
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
        })
    }
    public async saveFile(file: string): Promise<string>{
        const originalPath = path.resolve(uploadConfig.tmpFolder, file)

        const fileContent = await fs.promises.readFile(originalPath)

        const ContentType = mime.getType(originalPath)

        if(!ContentType) {
            throw new Error('File not found')
        }

        await this.client.putObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType,
        }).promise();

        await fs.promises.unlink(originalPath)

        return file
    }

    public async deleteFile(file: string): Promise<void>{
        await this.client.deleteObject({
            Bucket: 'app-gobarber-ramos',
            Key: file,
        }).promise();
    }
}
