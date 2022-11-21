import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../../users/entities/User';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { Statement } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

describe('Get Statement Operation - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;
  let statementsRepository: MockProxy<IStatementsRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
    statementsRepository = mock<IStatementsRepository>();
  });

  it('should throw error if user doesnt exists', async () => {
    usersRepository.findById.mockResolvedValue(undefined);

    const sut = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );

    await expect(
      sut.execute({ user_id: 'user_id', statement_id: 'statement_id' })
    ).rejects.toThrowError('User not found');
  });

  it('should return statement', async () => {
    usersRepository.findById.mockResolvedValue(new User());
    statementsRepository.findStatementOperation.mockResolvedValue(
      new Statement()
    );

    const sut = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );

    await sut.execute({
      user_id: 'user_id',
      statement_id: 'statement_id',
    });

    expect(statementsRepository.findStatementOperation).toHaveBeenCalledWith({
      user_id: 'user_id',
      statement_id: 'statement_id',
    });
  });
});
