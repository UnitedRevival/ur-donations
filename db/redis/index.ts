import Redis from 'ioredis';

const REDIS_URI = process.env.REDIS_URI as string;
const REDIS_USERNAME = process.env.REDIS_USERNAME as string;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;
const REDIS_PORT = process.env.REDIS_PORT as string;

let redis: null | Redis = null;
function connectRedis() {
  try {
    redis = new Redis({
      port: parseInt(REDIS_PORT), // Redis port
      host: REDIS_URI, // Redis host
      username: REDIS_USERNAME, // needs Redis >= 6
      password: REDIS_PASSWORD,
      db: 0, // Defaults to 0
      enableReadyCheck: false,
      maxRetriesPerRequest: 2,
    });
  } catch (err) {
    console.log('Could not connect to redis...', err);
  }
}

// connectRedis();

export default redis;
