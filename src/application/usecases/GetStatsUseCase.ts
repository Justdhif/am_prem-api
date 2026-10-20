import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { GetStatsOutputDto } from '../dto/alightMotion.dto.js';
import { MessagePresenter } from '../../presentation/presenters/messagePresenter.js';

export class GetStatsUseCase {
  constructor(private readonly statsRepository: IStatsRepository) {}

  public execute(): GetStatsOutputDto {
    const stats = this.statsRepository.getStats();
    const formattedText = MessagePresenter.formatStatsText(stats);

    return {
      totalPremium: stats.total,
      todayPremium: stats.today,
      status: 'Online 🟢',
      formattedText,
    };
  }
}
