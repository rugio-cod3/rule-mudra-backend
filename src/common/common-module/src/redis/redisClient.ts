import Redis from 'ioredis';
import config from '@/config/default'


const redis = new Redis({
  host: config.redisUrl,
  port: config.redisPort,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => {
  console.error('Redis error:', err.message);

  if ((err as any)?.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
    console.error('SSL misconfiguration detected. Stopping Redis reconnects.');
    redis.disconnect();
  }
});

export default redis;
