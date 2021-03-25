import { injectable, inject } from "tsyringe";

// import User from '../infra/typeorm/entities/Users';
import IUsersRepository from "../repositories/IUserRepository";
import IUsersTokensRepository from "../repositories/IUserTokensRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";
// import AppError from "@shared/errors/AppError";
import path from "path";

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUsersTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError('User does not exists.');
        }

        const {token} = await this.userTokensRepository.generate(user.id)

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            template: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
                }
            }
        })
    }
}

export default SendForgotPasswordEmailService;
