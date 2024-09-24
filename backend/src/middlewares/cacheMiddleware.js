const connectRedis = require('../config/redisClient.config');

const cacheMiddleware = (duration) => async (req, res, next) => {
  const redisClient = await connectRedis();
  const key = req.originalUrl;
  console.log('Cache key:', req.originalUrl);
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.setEx(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

module.exports = cacheMiddleware;