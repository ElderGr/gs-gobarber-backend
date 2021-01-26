import UsersToken from "../infra/typeorm/entities/UserToken";

export default interface IUserTokensRepository{
    generate(user_id: string): Promise<UsersToken>;
    findByToken(token: string): Promise<UsersToken | undefined>;
}
