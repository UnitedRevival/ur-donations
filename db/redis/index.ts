import Redis from 'ioredis';

const REDIS_URI = process.env.REDIS_URI as string;
const REDIS_USERNAME = process.env.REDIS_USERNAME as string;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;

const redis = new Redis({
  port: 16930, // Redis port
  host: REDIS_URI, // Redis host
  username: REDIS_USERNAME, // needs Redis >= 6
  password: REDIS_PASSWORD,
  db: 0, // Defaults to 0
  // TODO: Ready check...
});

export default redis;
