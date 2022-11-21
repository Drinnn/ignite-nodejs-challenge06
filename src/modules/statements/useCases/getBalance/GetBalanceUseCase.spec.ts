import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../../users/entities/User';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { Statement } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

describe('Get Balance - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;
  let statementsRepository: MockProxy<IStatementsRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
    statementsRepository = mock<IStatementsRepository>();
  });

  it('should throw error if user doesnt exists', async () => {
    usersRepository.findById.mockResolvedValue(undefined);

    const sut = new GetBalanceUseCase(statementsRepository, usersRepository);

    await expect(sut.execute({ user_id: 'user_id' })).rejects.toThrowError(
      'User not found'
    );
  });

  it('should return user balance', async () => {
    usersRepository.findById.mockResolvedValue(new User());
    statementsRepository.getUserBalance.mockResolvedValue({
      balance: 100,
      statement: [new Statement()],
    });

    const sut = new GetBalanceUseCase(statementsRepository, usersRepository);

    const result = await sut.execute({ user_id: 'user_id' });
    expect(result.balance).toBeDefined();
    expect(result.statement).toBeDefined();
  });
});
