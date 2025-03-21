import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import * as crypto from 'crypto';
import { QrcodeService } from '../qrcode/qrcode.service';

@Injectable()
export class ShortenerService {
  constructor(
    private prisma: PrismaService,
    private qrcodeService: QrcodeService,
  ) {}

  private generateSlug(): string {
    return crypto.randomBytes(3).toString('hex');
  }

  async findByUserId(userId: number) {
    return this.prisma.url.findMany({
      where: { userId },
      include: {
        _count: {
          select: { accesses: true },
        },
      },
    });
  }

  private async generateUniqueSlug(providedSlug?: string): Promise<string> {
    const slug = providedSlug || this.generateSlug();
    const existing = await this.prisma.url.findUnique({
      where: { short: slug },
    });
    if (existing) {
      if (providedSlug) {
        throw new BadRequestException('Slug já utilizado. Escolha outro.');
      }
      return this.generateUniqueSlug();
    }
    return slug;
  }

  async createUrl(createUrlDto: CreateUrlDto, userId?: number) {
    const slug = await this.generateUniqueSlug(createUrlDto.slug);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${slug}`;

    const url = await this.prisma.url.create({
      data: {
        original: createUrlDto.original,
        short: slug,
        userId,
      },
    });

    const qrCodeData = await this.qrcodeService.generateQRCode(shortUrl);

    const updatedUrl = await this.prisma.url.update({
      where: { id: url.id },
      data: { qrCode: qrCodeData },
    });

    return { ...updatedUrl, shortUrl };
  }

  async findBySlug(slug: string) {
    const url = await this.prisma.url.findUnique({ where: { short: slug } });
    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }
    return url;
  }
}
