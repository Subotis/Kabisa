import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { response } from 'express';
import { ApiClientModule } from './modules/api.client/api.client.module';
import { QuoteRepositoryModule } from './modules/quote.repository/quote.repository.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ApiClientModule, QuoteRepositoryModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getRandomQuote('application/json', response)).toBe(
        'Hello World!',
      );
    });
  });
});
