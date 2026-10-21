import { FirebaseAuthGateway } from './external/firebaseAuthGateway.js';
import { AlightGateway } from './external/alightGateway.js';
import { TikTokGateway } from './external/tikTokGateway.js';
import { PostgresStatsRepository } from './repositories/PostgresStatsRepository.js';
import { InMemorySessionRepository } from './repositories/InMemorySessionRepository.js';

import { SendVerificationLinkUseCase } from '../application/usecases/SendVerificationLinkUseCase.js';
import { VerifyMagicLinkUseCase } from '../application/usecases/VerifyMagicLinkUseCase.js';
import { GetStatsUseCase } from '../application/usecases/GetStatsUseCase.js';
import { HandleBotCommandUseCase } from '../application/usecases/HandleBotCommandUseCase.js';
import { FindAlightPresetUseCase } from '../application/usecases/FindAlightPresetUseCase.js';

export class Container {
  // Gateways
  public readonly firebaseAuthGateway = new FirebaseAuthGateway();
  public readonly alightGateway = new AlightGateway();
  public readonly tikTokGateway = new TikTokGateway();

  // Repositories (PostgreSQL dengan fallback lokal)
  public readonly statsRepository = new PostgresStatsRepository();
  public readonly sessionRepository = new InMemorySessionRepository();

  // Alight Motion Use Cases
  public readonly sendVerificationLinkUseCase = new SendVerificationLinkUseCase(
    this.firebaseAuthGateway,
    this.sessionRepository
  );

  public readonly verifyMagicLinkUseCase = new VerifyMagicLinkUseCase(
    this.firebaseAuthGateway,
    this.alightGateway,
    this.statsRepository,
    this.sessionRepository
  );

  public readonly getStatsUseCase = new GetStatsUseCase(this.statsRepository);

  public readonly findAlightPresetUseCase = new FindAlightPresetUseCase(this.tikTokGateway);

  public readonly handleBotCommandUseCase = new HandleBotCommandUseCase(
    this.sendVerificationLinkUseCase,
    this.verifyMagicLinkUseCase,
    this.getStatsUseCase,
    this.findAlightPresetUseCase,
    this.firebaseAuthGateway,
    this.sessionRepository
  );
}

export const container = new Container();
