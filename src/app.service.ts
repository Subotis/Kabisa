import { Injectable, Logger } from '@nestjs/common';
import { ApiQuoteInterface } from './interfaces/api.quote.interface';
import { ApiClientService } from './modules/api.client/api.client.service';
import { QuoteRepositoryService } from './modules/quote.repository/quote.repository.service';
import { ResponseQuoteInterface } from './interfaces/response.quote.interface';
import { setLikeDto } from './modules/quote.repository/dtos/setLikeDto';

@Injectable()
export class AppService {
  constructor(
    private readonly apiService: ApiClientService,
    private readonly quoteRepositoryService: QuoteRepositoryService,
  ) {}
  private readonly logger = new Logger(AppService.name);
  async getRandomQuote(): Promise<ResponseQuoteInterface> {
    try {
      const randomQuote: ApiQuoteInterface =
        await this.apiService.getRandomQuote();
      const createdQuote = await this.quoteRepositoryService.create(
        randomQuote,
      );
      return {
        id: createdQuote._id,
        author: createdQuote.author,
        watches: createdQuote.watches,
        likes: createdQuote.likes,
        quote: createdQuote.quote,
      };
    } catch (e) {
      this.logger.log(e.message);
      const [randomLocalQuote] =
        await this.quoteRepositoryService.getRandomQuote();
      if (randomLocalQuote) {
        return {
          id: randomLocalQuote._id,
          author: randomLocalQuote.author,
          watches: randomLocalQuote.watches,
          likes: randomLocalQuote.likes,
          quote: randomLocalQuote.quote,
        };
      }
    }
  }
  async setLike(id: setLikeDto): Promise<ResponseQuoteInterface> {
    try {
      const likedQuote = await this.quoteRepositoryService.setLike(id);
      if (likedQuote) {
        return {
          id: likedQuote._id,
          author: likedQuote.author,
          watches: likedQuote.watches,
          likes: likedQuote.likes,
          quote: likedQuote.quote,
        };
      } else return;
    } catch (e) {
      this.logger.log(e.message);
    }
  }
}
