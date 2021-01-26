import UsersToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { uuid } from 'uuidv4';

import User from '../../infra/typeorm/entities/Users';

class FakeUserTokensRepository implements IUserTokensRepository {

    private usersTokens: UsersToken[] = [];

    public async generate(user_id: string): Promise<UsersToken>{
        const userToken = new UsersToken()

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        this.usersTokens.push(userToken)

        return userToken;
    }

    public async findByToken(token: string): Promise<UsersToken | undefined>{
        const userToken = this.usersTokens.find(findToken => findToken.token === token);

        return userToken;
    }
}

export default FakeUserTokensRepository;
