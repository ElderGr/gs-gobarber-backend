import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import User from "../infra/typeorm/entities/Users";

interface IRequest{
    name: string;
    user_id: string;
    email: string;
    password?: string;
    old_password?: string;
}

@injectable()
class UpdateProfile{

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ email, name, user_id, old_password, password }: IRequest): Promise<User>{
        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError("User not found")
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id){
            throw new AppError("E-mail already in use.")
        }

        user.name = name;
        user.email = email;

        if(password && !old_password){
            throw new AppError("You need to informe the old password to set a new password")
        }


        if(password && old_password){
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password
            );

            if(!checkOldPassword){
                throw new AppError('Old password does not match.')
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfile
