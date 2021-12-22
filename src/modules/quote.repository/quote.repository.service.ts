import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { ApiQuoteInterface } from '../../interfaces/api.quote.interface';
import { DATABASE_CONNECTION } from '../../constants/constants';
import { QuoteInterface } from '../../interfaces/quote.interface';
import { InjectConnection } from '@nestjs/mongoose';
import { QuoteSchema } from './schemas/quote.schema';
import * as crypto from 'crypto';
import { setLikeDto } from './dtos/setLikeDto';

@Injectable()
export class QuoteRepositoryService implements OnApplicationBootstrap {
  private quoteModel;
  constructor(
    @InjectConnection(DATABASE_CONNECTION)
    private readonly reportsMongoConnection: Connection,
  ) {}
  private readonly logger = new Logger(QuoteRepositoryService.name);

  onApplicationBootstrap(): any {
    this.quoteModel = this.getQuotesModel();
  }

  async create(externalQuote: ApiQuoteInterface): Promise<QuoteInterface> {
    try {
      const hash = crypto
        .createHash('md5')
        .update(externalQuote.author + externalQuote.quote)
        .digest('hex');
      const presentInstance = await this.quoteModel.findOne({ hash });
      if (!presentInstance) {
        const createdQuote = new this.quoteModel(externalQuote);
        createdQuote.hash = hash;
        return createdQuote.save();
      }
      presentInstance.watches++;
      return presentInstance.save();
    } catch (e) {
      this.logger.log(e.message);
    }
  }

  async setLike(id: setLikeDto): Promise<QuoteInterface> {
    try {
      const presentInstance = await this.quoteModel.findById(id);
      if (presentInstance) {
        presentInstance.likes++;
        return presentInstance.save();
      } else {
        return;
      }
    } catch (e) {
      this.logger.log(e.message);
    }
  }

  async getRandomQuote(): Promise<QuoteInterface[]> {
    return this.quoteModel.aggregate([{ $sample: { size: 1 } }]).exec();
  }

  private getQuotesModel(): Model<QuoteInterface> {
    return (
      this.reportsMongoConnection.models['quotes'] ||
      this.reportsMongoConnection.model<QuoteInterface>('quotes', QuoteSchema)
    );
  }
}
