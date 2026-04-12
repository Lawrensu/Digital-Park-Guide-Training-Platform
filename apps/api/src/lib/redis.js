import Redis from 'ioredis';

// refresh tokens only — don't store anything else here
const redis = new Redis(process.env.REDIS_URL);

export default redis;
