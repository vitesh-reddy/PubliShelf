import Analytics from "../models/Analytics.model.js";
import { safeRedisOperation } from "../config/redis.js";
import logger from "../config/logger.js";

const TOTAL_VIEWS_KEY = "analytics:total_views";
const TODAY_VIEWS_KEY = "analytics:today_views";
const TODAY_USERS_KEY = "analytics:today_users";

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const incrementPageView = async (userId) => {
  const today = getTodayDate();
  const userIdentifier = userId || "anonymous";

  await safeRedisOperation(async (client) => {
    await client.incr(TOTAL_VIEWS_KEY);
    await client.incr(`${TODAY_VIEWS_KEY}:${today}`);
    await client.sAdd(`${TODAY_USERS_KEY}:${today}`, userIdentifier);
  });

  try {
    await Analytics.findOneAndUpdate(
      { date: today },
      {
        $inc: { totalViews: 1 },
        $addToSet: { uniqueUsers: userIdentifier },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    logger.error("Failed to persist analytics to MongoDB:", error);
  }
};

export const getFooterStats = async () => {
  const today = getTodayDate();

  let totalViews = 0;
  let viewsToday = 0;
  let usersToday = 0;

  const redisStats = await safeRedisOperation(async (client) => {
    const [total, todayViews, todayUsers] = await Promise.all([
      client.get(TOTAL_VIEWS_KEY),
      client.get(`${TODAY_VIEWS_KEY}:${today}`),
      client.sCard(`${TODAY_USERS_KEY}:${today}`),
    ]);
    return {
      totalViews: parseInt(total) || 0,
      viewsToday: parseInt(todayViews) || 0,
      usersToday: todayUsers || 0,
    };
  });

  if (redisStats) {
    totalViews = redisStats.totalViews;
    viewsToday = redisStats.viewsToday;
    usersToday = redisStats.usersToday;
  } else {
    try {
      const todayDoc = await Analytics.findOne({ date: today });
      const allDocs = await Analytics.find({});

      totalViews = allDocs.reduce((sum, doc) => sum + doc.totalViews, 0);
      viewsToday = todayDoc?.totalViews || 0;
      usersToday = todayDoc?.uniqueUsers?.length || 0;

      await safeRedisOperation(async (client) => {
        await client.set(TOTAL_VIEWS_KEY, totalViews.toString());
        await client.set(`${TODAY_VIEWS_KEY}:${today}`, viewsToday.toString());
        if (todayDoc?.uniqueUsers) {
          for (const user of todayDoc.uniqueUsers) {
            await client.sAdd(`${TODAY_USERS_KEY}:${today}`, user);
          }
        }
      });
    } catch (error) {
      logger.error("Failed to fetch analytics from MongoDB:", error);
    }
  }

  return {
    totalViews,
    viewsToday,
    usersToday,
    serverTime: new Date().toISOString().split("T")[0],
  };
};

export const initializeAnalytics = async () => {
  const today = getTodayDate();

  try {
    const allDocs = await Analytics.find({});
    const totalViews = allDocs.reduce((sum, doc) => sum + doc.totalViews, 0);

    await safeRedisOperation(async (client) => {
      const existing = await client.get(TOTAL_VIEWS_KEY);
      if (!existing) {
        await client.set(TOTAL_VIEWS_KEY, totalViews.toString());
        logger.info(`Initialized total views from MongoDB: ${totalViews}`);
      }
    });

    const todayDoc = await Analytics.findOne({ date: today });
    if (todayDoc) {
      await safeRedisOperation(async (client) => {
        await client.set(`${TODAY_VIEWS_KEY}:${today}`, todayDoc.totalViews.toString());
        if (todayDoc.uniqueUsers) {
          for (const user of todayDoc.uniqueUsers) {
            await client.sAdd(`${TODAY_USERS_KEY}:${today}`, user);
          }
        }
      });
      logger.info(`Initialized today's analytics from MongoDB`);
    }
  } catch (error) {
    logger.error("Failed to initialize analytics:", error);
  }
};
