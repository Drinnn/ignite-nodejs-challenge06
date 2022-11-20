import { hashSync } from 'bcryptjs';
import { MockProxy, mock } from 'jest-mock-extended';
import { User } from '../../entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
  });

  it('should throw error if user doesnt exists', async () => {
    usersRepository.findByEmail.mockResolvedValue(undefined);

    const input = {
      email: 'john@doe.com',
      password: 'secure_password',
    };

    const sut = new AuthenticateUserUseCase(usersRepository);

    await expect(sut.execute(input)).rejects.toThrowError(
      'Incorrect email or password'
    );
  });

  it('should throw error if passwords dont match', async () => {
    const user = new User();
    user.email = 'john@doe.com';
    user.password = 'correct';
    usersRepository.findByEmail.mockResolvedValue(user);

    const input = {
      email: 'john@doe.com',
      password: 'incorrect_password',
    };

    const sut = new AuthenticateUserUseCase(usersRepository);

    await expect(sut.execute(input)).rejects.toThrowError(
      'Incorrect email or password'
    );
  });

  it('should authenticate user', async () => {
    process.env.JWT_SECRET = 'test';

    const user = new User();
    user.email = 'john@doe.com';
    user.password = hashSync('password', 8);
    user.name = 'John Doe';
    usersRepository.findByEmail.mockResolvedValue(user);

    const input = {
      email: 'john@doe.com',
      password: 'password',
    };

    const sut = new AuthenticateUserUseCase(usersRepository);

    const result = await sut.execute(input);

    expect(result).toHaveProperty('token');
    expect(result.user.name).toEqual('John Doe');
    expect(result.user.email).toEqual('john@doe.com');
  });
});
