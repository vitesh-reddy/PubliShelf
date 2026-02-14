import { Server } from "socket.io";
import { CLIENT_URL } from "../config/env.js";
import logger from "../config/logger.js";
import { initializeAuctionSocket } from "./auction/auction.socket.js";

export const initializeSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: CLIENT_URL,
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    logger.info("Socket.IO initialized");

    // Initialize auction namespace
    initializeAuctionSocket(io);

    return io;
  } catch (error) {
    logger.error(`Failed to initialize Socket.IO: ${error.message}`);
    throw error;
  }
};
