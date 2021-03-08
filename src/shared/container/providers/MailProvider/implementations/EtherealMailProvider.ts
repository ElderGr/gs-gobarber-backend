import IMailProvider from '../models/IMailProvider'
import nodemailer, { Transporter } from 'nodemailer';

export default class FakeMailProvider implements IMailProvider{
    private client: Transporter;

    constructor(){
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter;
        });
    }

    public async sendMail(to: string, body: string): Promise<void>{
        const message = await this.client.sendMail({
            from: 'Equipe GoBarber <equipe@gobarber.com.br>',
            to,
            subject: 'Recuperação de senha',
            text: body,
        })

        console.log('message sent: %s', message.messageId)
        console.log('preview URL: %s', nodemailer.getTestMessageUrl(message))
    }
}
