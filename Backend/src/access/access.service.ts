import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessDto } from './dtos/create-access.dto';
import axios from 'axios';

@Injectable()
export class AccessService {
  constructor(private prisma: PrismaService) {}

  private async getLocationFromIp(ip: string): Promise<string> {
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      const { city, region, country_name } = response.data;
      return [city, region, country_name].filter(Boolean).join(', ');
    } catch (error) {
      return 'Localização não disponível';
    }
  }

  async findAccessesByUrlId(urlId: number | string) {
    const id = typeof urlId === 'string' ? parseInt(urlId, 10) : urlId;
    return this.prisma.access.findMany({
      where: { urlId: id },
    });
  }

  async registerAccess(createAccessDto: CreateAccessDto) {
    let location = createAccessDto.location;
    if (!location || location.trim() === '') {
      location = await this.getLocationFromIp(createAccessDto.ip);
    }

    return this.prisma.access.create({
      data: {
        urlId: createAccessDto.urlId,
        ip: createAccessDto.ip,
        userAgent: createAccessDto.userAgent,
        referer: createAccessDto.referer,
        acceptLanguage: createAccessDto.acceptLanguage,
        location,
      },
    });
  }
}
