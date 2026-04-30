const Redis = require("ioredis");

// Initialize Redis client. If it fails to connect, it will log an error but shouldn't crash the app if handled properly.
let redisClient;
try {
  redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    lazyConnect: true,
    showFriendlyErrorStack: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      // Prevent infinite retry loop if Redis is not running locally
      if (times > 2) {
        return null;
      }
      return Math.min(times * 50, 2000);
    }
  });

  redisClient.on('error', (err) => {
    console.warn("Redis connection error (Caching will be bypassed):", err.message);
  });
} catch (error) {
  console.warn("Redis initialization failed. Proceeding without cache.");
}

const cacheNotes = async (req, res, next) => {
  if (!redisClient || redisClient.status !== 'ready') {
    return next(); // Bypass cache if Redis isn't ready
  }

  const userId = req.user.id;
  const key = `notes:${userId}`;

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    console.error("Redis Cache Error:", err);
    next();
  }
};

const clearCache = async (userId) => {
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    await redisClient.del(`notes:${userId}`);
  } catch (err) {
    console.error("Redis Clear Cache Error:", err);
  }
}

module.exports = { cacheNotes, clearCache, redisClient };
