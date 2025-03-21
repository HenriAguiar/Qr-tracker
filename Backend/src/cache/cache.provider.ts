import { Provider } from '@nestjs/common';
import { caching } from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';

export const CACHE_MANAGER_PROVIDER: Provider = {
  provide: 'CACHE_MANAGER',
  useFactory: async () => {
    const cache = caching({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: 60,
    });
    return cache;
  },
};
