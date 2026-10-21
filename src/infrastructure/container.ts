import { FirebaseAuthGateway } from './external/firebaseAuthGateway.js';
import { AlightGateway } from './external/alightGateway.js';
import { FileStatsRepository } from './repositories/FileStatsRepository.js';
import { InMemorySessionRepository } from './repositories/InMemorySessionRepository.js';
import { JsonUserRepository } from './repositories/JsonUserRepository.js';

import { SendVerificationLinkUseCase } from '../application/usecases/SendVerificationLinkUseCase.js';
import { VerifyMagicLinkUseCase } from '../application/usecases/VerifyMagicLinkUseCase.js';
import { GetStatsUseCase } from '../application/usecases/GetStatsUseCase.js';
import { HandleBotCommandUseCase } from '../application/usecases/HandleBotCommandUseCase.js';

import { RegisterUseCase } from '../application/usecases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../application/usecases/auth/LoginUseCase.js';
import { GetProfileUseCase } from '../application/usecases/auth/GetProfileUseCase.js';
import { SubscribePlanUseCase } from '../application/usecases/billing/SubscribePlanUseCase.js';
import { RegenerateApiKeyUseCase } from '../application/usecases/billing/RegenerateApiKeyUseCase.js';
import { ValidateApiKeyUseCase } from '../application/usecases/billing/ValidateApiKeyUseCase.js';

export class Container {
  // Gateways
  public readonly firebaseAuthGateway = new FirebaseAuthGateway();
  public readonly alightGateway = new AlightGateway();

  // Repositories
  public readonly statsRepository = new FileStatsRepository();
  public readonly sessionRepository = new InMemorySessionRepository();
  public readonly userRepository = new JsonUserRepository();

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

  public readonly handleBotCommandUseCase = new HandleBotCommandUseCase(
    this.sendVerificationLinkUseCase,
    this.verifyMagicLinkUseCase,
    this.getStatsUseCase,
    this.firebaseAuthGateway,
    this.sessionRepository
  );

  // Auth & Billing Use Cases
  public readonly registerUseCase = new RegisterUseCase(this.userRepository);
  public readonly loginUseCase = new LoginUseCase(this.userRepository);
  public readonly getProfileUseCase = new GetProfileUseCase(this.userRepository);
  public readonly subscribePlanUseCase = new SubscribePlanUseCase(this.userRepository);
  public readonly regenerateApiKeyUseCase = new RegenerateApiKeyUseCase(this.userRepository);
  public readonly validateApiKeyUseCase = new ValidateApiKeyUseCase(this.userRepository);
}

export const container = new Container();
