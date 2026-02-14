import { verifyToken } from "../../utils/jwt.js";
import logger from "../../config/logger.js";

const parseCookies = (cookieString) => {
  const cookies = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      cookies[name.trim()] = rest.join('=').trim();
    });
  }
  return cookies;
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Try to get token from cookies first (httpOnly cookie from REST API)
    const cookieString = socket.handshake.headers.cookie;
    const cookies = parseCookies(cookieString);
    let token = cookies.token;

    // Fallback to auth header for backwards compatibility
    if (!token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      logger.warn(`Socket connection rejected: No token provided`);
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    
    logger.info(`Socket authenticated: userId=${decoded.id}, role=${decoded.role}`);
    next();
  } catch (error) {
    logger.error(`Socket authentication failed: ${error.message}`);
    next(new Error("Authentication error: Invalid or expired token"));
  }
};
