import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccessDto {
  @ApiProperty({ example: 1, description: 'ID da URL acessada' })
  @IsNotEmpty()
  @IsNumber()
  urlId: number;

  @ApiProperty({ example: '192.168.0.1', description: 'Endereço IP do usuário' })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({ example: 'Mozilla/5.0 (Macintosh; ...)', description: 'User Agent do navegador' })
  @IsNotEmpty()
  @IsString()
  userAgent: string;

  @ApiPropertyOptional({ example: 'https://google.com', description: 'Referer da requisição' })
  @IsOptional()
  @IsString()
  referer?: string;

  @ApiPropertyOptional({ example: 'en-US,en;q=0.9', description: 'Cabeçalho Accept-Language' })
  @IsOptional()
  @IsString()
  acceptLanguage?: string;

  @ApiPropertyOptional({ example: 'São Paulo, Brasil' })
  @IsOptional()
  @IsString()
  location?: string;
}
