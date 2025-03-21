import { Module } from '@nestjs/common';
import { CACHE_MANAGER_PROVIDER } from './cache.provider';

@Module({
  providers: [CACHE_MANAGER_PROVIDER],
  exports: [CACHE_MANAGER_PROVIDER],
})
export class CacheModule {}
