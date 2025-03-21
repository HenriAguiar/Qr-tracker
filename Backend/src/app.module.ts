import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenerModule } from './shortener/shortener.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { AccessModule } from './access/access.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CACHE_MANAGER_PROVIDER } from './cache/cache.provider';

@Module({
  imports: [
    ShortenerModule,
    QrcodeModule,
    AccessModule,
    AuthModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, CACHE_MANAGER_PROVIDER],
})
export class AppModule {}
