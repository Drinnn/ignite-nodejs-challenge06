import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

describe('Show User Profile - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
  });

  it('should throw error if user doesnt exists', async () => {
    usersRepository.findById.mockResolvedValue(undefined);

    const sut = new ShowUserProfileUseCase(usersRepository);

    await expect(sut.execute('user_id')).rejects.toThrowError('User not found');
  });

  it('should return user', async () => {
    const user = new User();
    usersRepository.findById.mockResolvedValue(user);

    const sut = new ShowUserProfileUseCase(usersRepository);

    const result = await sut.execute('user_id');
    expect(result).toHaveProperty('id');
  });
});
