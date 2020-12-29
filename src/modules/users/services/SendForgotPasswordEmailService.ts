import { injectable, inject } from "tsyringe";

// import User from '../infra/typeorm/entities/Users';
import IUsersRepository from "../repositories/IUserRepository";
import IUsersTokensRepository from "../repositories/IUserTokensRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";
// import AppError from "@shared/errors/AppError";

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

        await this.userTokensRepository.generate(user.id)

        this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido')
    }
}

export default SendForgotPasswordEmailService;
