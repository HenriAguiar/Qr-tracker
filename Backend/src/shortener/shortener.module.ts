import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { RedirectController } from './redirect.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QrcodeModule } from '../qrcode/qrcode.module';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [PrismaModule, QrcodeModule, AccessModule],
  controllers: [ShortenerController, RedirectController],
  providers: [ShortenerService],
})
export class ShortenerModule {}
