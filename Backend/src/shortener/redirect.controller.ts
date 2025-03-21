import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ShortenerService } from './shortener.service';
import { AccessService } from '../access/access.service';

@Controller()
export class RedirectController {
  constructor(
    private readonly shortenerService: ShortenerService,
    private readonly accessService: AccessService,
  ) {}

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    const url = await this.shortenerService.findBySlug(slug);

    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';

    await this.accessService.registerAccess({
      urlId: url.id,
      ip: ip.toString(),
      userAgent: userAgent.toString(),
      referer: referer.toString(),
      acceptLanguage: acceptLanguage.toString(),
      location: '',
    });

    return res.redirect(url.original);
  }
}
