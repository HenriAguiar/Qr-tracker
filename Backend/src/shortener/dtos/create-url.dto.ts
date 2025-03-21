import { IsNotEmpty, IsOptional, IsUrl, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://www.exemplo.com' })
  @IsUrl()
  original: string;

  @ApiPropertyOptional({ example: 'slug-personalizado' })
  @IsOptional()
  @IsString()
  slug?: string;
}
