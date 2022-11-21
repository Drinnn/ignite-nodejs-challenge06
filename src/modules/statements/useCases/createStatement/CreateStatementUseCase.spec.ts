import { mock } from 'jest-mock-extended';
import { MockProxy } from 'jest-mock-extended/lib/Mock';
import { User } from '../../../users/entities/User';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { OperationType } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

describe('Create Statement - Use Case', () => {
  let usersRepository: MockProxy<IUsersRepository>;
  let statementsRepository: MockProxy<IStatementsRepository>;

  beforeAll(() => {
    usersRepository = mock<IUsersRepository>();
    statementsRepository = mock<IStatementsRepository>();
  });

  it('should throw error if user doesnt exists', async () => {
    usersRepository.findById.mockResolvedValue(undefined);

    const sut = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    const input: ICreateStatementDTO = {
      amount: 100,
      description: 'Statement description',
      type: OperationType.DEPOSIT,
      user_id: 'user_id',
    };

    await expect(sut.execute(input)).rejects.toThrowError('User not found');
  });

  it('should throw error if user doesnt have enough balance', async () => {
    usersRepository.findById.mockResolvedValue(new User());
    statementsRepository.getUserBalance.mockResolvedValue({ balance: 100 });

    const input: ICreateStatementDTO = {
      amount: 150,
      description: 'Statement description',
      type: OperationType.WITHDRAW,
      user_id: 'user_id',
    };

    const sut = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    await expect(sut.execute(input)).rejects.toThrowError('Insufficient funds');
  });

  it('should create statement', async () => {
    usersRepository.findById.mockResolvedValue(new User());

    const input: ICreateStatementDTO = {
      amount: 150,
      description: 'Statement description',
      type: OperationType.DEPOSIT,
      user_id: 'user_id',
    };

    const sut = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    await sut.execute(input);

    expect(statementsRepository.create).toHaveBeenCalledWith({
      user_id: 'user_id',
      description: 'Statement description',
      type: OperationType.DEPOSIT,
      amount: 150,
    });
  });
});
