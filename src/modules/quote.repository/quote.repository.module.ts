import { Module } from '@nestjs/common';
import { QuoteRepositoryService } from './quote.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from '../../constants/constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
      connectionName: DATABASE_CONNECTION,
    }),
  ],
  controllers: [],
  providers: [QuoteRepositoryService],
  exports: [QuoteRepositoryService],
})
export class QuoteRepositoryModule {}
