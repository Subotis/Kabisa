import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as xmlJs from 'xml-js';
import { setLikeDto } from './modules/quote.repository/dtos/setLikeDto';
import {
  ApiOkResponse,
  ApiProduces,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { string } from 'joi';
import { acceptableContentTypes } from './enums/acceptable.content.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Quote')
  @ApiOkResponse({
    description: 'Gathered random quote',
    schema: {
      type: 'string',
      example:
        '{"id":"61c2a4ce0936790b78324a15","author":"Edward V Berard","watches":2,"likes":0,"quote":"Walking on water and developing software from a specification are easy if both are frozen."}',
    },
  })
  @ApiProduces('application/json', 'text/xml', 'application/xml')
  @ApiUnsupportedMediaTypeResponse({
    description: 'Wrong content-type passed',
  })
  @Get()
  async getRandomQuote(
    @Headers('accept') contentType: string,
    @Res() response,
  ): Promise<void> {
    if (!acceptableContentTypes.some((type) => contentType.includes(type))) {
      throw new HttpException(
        'Unsupported Media Type',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
    const quote = await this.appService.getRandomQuote();
    if (!quote) {
      throw new HttpException('No Content', HttpStatus.NO_CONTENT);
    }
    let responseBody = JSON.stringify(quote);
    if (
      contentType.includes('application/json') ||
      contentType.includes('*/*')
    ) {
      response.set({ 'Content-Type': 'application/json' });
    } else {
      response.set({ 'Content-Type': 'application/xml' });
      responseBody = xmlJs.json2xml(responseBody, {
        compact: true,
        ignoreComment: true,
        spaces: 4,
      });
    }
    response.send(responseBody);
  }

  @ApiTags('Like')
  @ApiOkResponse({
    description: 'Liked quote by id',
    schema: {
      type: 'string',
      example:
        '{"id":"61c2a4ce0936790b78324a15","author":"Edward V Berard","watches":2,"likes":1,"quote":"Walking on water and developing software from a specification are easy if both are frozen."}',
    },
  })
  @ApiProduces('application/json')
  @ApiUnsupportedMediaTypeResponse({
    description: 'Wrong content-type passed',
  })
  @Post()
  async setLike(
    @Headers('accept') contentType: string,
    @Res() response,
    @Body() setLikeDto: setLikeDto,
  ): Promise<void> {
    if (!contentType.includes('application/json')) {
      throw new HttpException(
        'Unsupported Media Type',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    response.set({ 'Content-Type': 'application/json' });
    response.status(200);
    const updatedQuote = await this.appService.setLike(setLikeDto);

    if (!updatedQuote) {
      throw new HttpException('Quote Not Found', HttpStatus.NOT_FOUND);
    }

    response.send(JSON.stringify(updatedQuote));
  }
}
