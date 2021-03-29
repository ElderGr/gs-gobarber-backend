import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'
import { injectable, inject } from 'tsyringe';
import mailConfig from "@config/mail";

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import aws from 'aws-sdk';

@injectable()
export default class SESMailProvider implements IMailProvider{
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ){
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_DEFAULT_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
            })
        })
    }

    public async sendMail({ to, subject, from, template }: ISendMailDTO): Promise<void>{
        const { name, email } = mailConfig.defaults.from
        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            html: await this.mailTemplateProvider.parse(template),
        })
    }
}
