import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class setLikeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Quote id',
    type: 'string',
  })
  id: string;
}
