import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('Create User - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
  });

  it('should throw error if user already exists', async () => {
    const user = new User();
    user.email = 'john@doe.com';
    usersRepository.findByEmail.mockResolvedValue(user);

    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'secure_password',
    };

    const sut = new CreateUserUseCase(usersRepository);

    await expect(sut.execute(input)).rejects.toThrowError(
      'User already exists'
    );
  });

  it('should create user', async () => {
    usersRepository.findByEmail.mockResolvedValue(undefined);

    const user = new User();
    usersRepository.create.mockResolvedValue(user);

    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'secure_password',
    };

    const sut = new CreateUserUseCase(usersRepository);

    const result = await sut.execute(input);
    expect(result).toHaveProperty('id');
  });
});
