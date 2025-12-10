

import { Redis } from 'ioredis';
require('dotenv').config();


const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log('Redis connected');
    return process.env.REDIS_URL;
  }
  throw new Error('Redis connection failed');
};

export const redis = new Redis(redisClient());


//redis-cli --tls -u redis://default:ATfPAAIncDI4ZTU2YmZiN2ZjOWI0NjM2ODZkZmExY2FiY2RlMWIyMHAyMTQyODc@adequate-chow-14287.upstash.io:6379