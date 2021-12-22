import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiQuoteInterface } from '../../interfaces/api.quote.interface';

@Injectable()
export class ApiClientService {
  constructor(private httpService: HttpService) {}
  async getRandomQuote(): Promise<ApiQuoteInterface> {
    return await firstValueFrom(this.httpService.get('/random.json')).then(
      (resp) => resp.data,
    );
  }
}
