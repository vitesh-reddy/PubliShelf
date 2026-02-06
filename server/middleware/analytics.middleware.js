import { incrementPageView } from "../services/analytics.services.js";

const recentRequests = new Map();
const DEDUP_WINDOW_MS = 2000;

const EXCLUDED_PATHS = [
  "/ready",
  "/health",
  "/api/ready",
  "/api/health",
  "/favicon.ico",
  "/api/system/stats",
  "/api/auth/me",
];

const isStaticAsset = (path) => {
  const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf"];
  return staticExtensions.some((ext) => path.endsWith(ext));
};

const shouldTrackView = (path) => {
  if (EXCLUDED_PATHS.includes(path)) return false;
  if (isStaticAsset(path)) return false;
  return true;
};

const isDuplicateRequest = (userId, path) => {
  const key = `${userId}:${path}`;
  const now = Date.now();
  const lastTime = recentRequests.get(key);
  
  if (lastTime && (now - lastTime) < DEDUP_WINDOW_MS) {
    return true;
  }
  
  recentRequests.set(key, now);
  
  if (recentRequests.size > 1000) {
    const entries = Array.from(recentRequests.entries());
    entries.sort((a, b) => a[1] - b[1]);
    entries.slice(0, 500).forEach(([k]) => recentRequests.delete(k));
  }
  
  return false;
};

export const analyticsMiddleware = (req, res, next) => {
  if (shouldTrackView(req.path)) {
    const userId = req.user?.id || req.ip;
    
    if (!isDuplicateRequest(userId, req.path)) {
      incrementPageView(userId).catch((error) => {
        console.error("Failed to track page view:", error);
      });
    }
  }
  next();
};
