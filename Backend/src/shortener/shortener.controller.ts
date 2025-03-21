import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUrlDto } from './dtos/create-url.dto';
import { ShortenerService } from './shortener.service';

@ApiTags('shortener')
@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: Request) {
    const userId = req['user']?.id;
    return this.shortenerService.createUrl(createUrlDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-urls')
  async getMyUrls(@Req() req: Request) {
    const userId = req['user']?.id;
    return this.shortenerService.findByUserId(userId);
  }
}
