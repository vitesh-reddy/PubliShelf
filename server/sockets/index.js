import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { CLIENT_URL } from "../config/env.js";
import logger from "../config/logger.js";
import { initializeAuctionSocket } from "./auction/auction.socket.js";

export const initializeSocket = async (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: CLIENT_URL,
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    logger.info("Socket.IO initialized");

    // Initialize Redis adapter for multi-process broadcasting
    await initializeRedisAdapter(io);

    // Initialize auction namespace
    initializeAuctionSocket(io);

    return io;
  } catch (error) {
    logger.error(`Failed to initialize Socket.IO: ${error.message}`);
    throw error;
  }
};

const initializeRedisAdapter = async (io) => {
  const REDIS_URL = process.env.REDIS_URL;

  if (!REDIS_URL) {
    logger.warn("REDIS_URL not configured. Socket.IO will run in single-instance mode.");
    return;
  }

  try {
    // Create pub/sub Redis clients for Socket.IO adapter
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();

    // Error handlers to prevent crashes
    pubClient.on("error", (err) => {
      logger.error("Socket.IO Redis Pub Client Error:", err.message);
    });

    subClient.on("error", (err) => {
      logger.error("Socket.IO Redis Sub Client Error:", err.message);
    });

    // Connect both clients
    await pubClient.connect();
    logger.info("Socket.IO Redis pub client connected");

    await subClient.connect();
    logger.info("Socket.IO Redis sub client connected");

    // Attach Redis adapter to Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("Socket.IO Redis adapter attached successfully (multi-process mode enabled)");
  } catch (error) {
    logger.error(`Failed to initialize Redis adapter: ${error.message}`);
    logger.warn("Socket.IO will continue in single-instance mode");
    // Don't throw - allow Socket.IO to work without Redis adapter
  }
};
