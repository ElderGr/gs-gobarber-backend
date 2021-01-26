import ResetPasswordService from './ResetPasswordService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUsersTokenRepository: FakeUsersTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () =>{
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUsersTokenRepository = new FakeUsersTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsersTokenRepository,
            fakeHashProvider
        )
    })

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const { token } = await fakeUsersTokenRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPassword.execute({
            password: '123123',
            token
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123')
        expect(updatedUser?.password).toBe('123123');
    })

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUsersTokenRepository.generate('non-existing-user')

        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const { token } = await fakeUsersTokenRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({
            password: '123123',
            token
        })).rejects.toBeInstanceOf(AppError)
    })
});


// hash
// 2h expiração
