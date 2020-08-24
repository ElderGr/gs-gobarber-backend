import { sign } from 'jsonwebtoken';
import { injectable, inject } from "tsyringe";

import User from '../infra/typeorm/entities/Users';
import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";

import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({email, password}: IRequest): Promise<IResponse>{
        const user = await this.usersRepository.findByEmail(email)

        if(!user){
            throw new AppError('Incorrect email/password combination.', 401)
        }

        const passworMatched = await this.hashProvider.compareHash(password, user.password);

        if(!passworMatched){
            throw new AppError('Incorrect email/password combination.', 401)
        }

        const {secret, expiresIn} = authConfig.jwt;

        const token = sign({}, secret,{
            subject: user.id,
            expiresIn: expiresIn,
        });

        return {
            user,
            token
        };
    }
}

export default AuthenticateUserService;
