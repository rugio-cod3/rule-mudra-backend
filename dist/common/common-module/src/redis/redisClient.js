import Redis from 'ioredis';
import config from '@/config/default';
var redis = new Redis({
    host: config.redisUrl,
    port: config.redisPort
});
redis.on('connect', function() {
    return console.log('✅ Redis connected');
});
redis.on('error', function(err) {
    console.error('Redis error:', err.message);
    if ((err === null || err === void 0 ? void 0 : err.code) === 'ERR_SSL_WRONG_VERSION_NUMBER') {
        console.error('SSL misconfiguration detected. Stopping Redis reconnects.');
        redis.disconnect();
    }
});
export default redis;

//# sourceMappingURL=redisClient.js.map