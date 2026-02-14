import logger from "../../config/logger.js";
import { socketAuthMiddleware } from "./auction.middleware.js";
import { joinAuctionRoom, leaveAuctionRoom } from "./auction.room.js";
import { registerAuctionHandlers } from "./auction.handlers.js";
import { emitAudienceUpdate } from "./auction.emitter.js";

export const initializeAuctionSocket = (io) => {
  const auctionNamespace = io.of("/auction");

  // Attach authentication middleware
  auctionNamespace.use(socketAuthMiddleware);

  auctionNamespace.on("connection", (socket) => {
    logger.info(`Client connected to auction namespace: socketId=${socket.id}, userId=${socket.user.id}`);

    // Track which auction this socket is viewing
    socket.currentAuctionId = null;

    // Register auction event handlers
    registerAuctionHandlers(socket, io);

    // Handle joinAuction event
    socket.on("joinAuction", async (data) => {
      try {
        const { auctionId } = data;

        if (!auctionId) {
          socket.emit("auctionError", { message: "Auction ID is required" });
          return;
        }

        const room = await joinAuctionRoom(socket, auctionId);
        socket.currentAuctionId = auctionId; // Track current auction
        logger.info(`User ${socket.user.id} joined auction room: ${room}`);

        socket.emit("joinedAuction", { 
          success: true, 
          auctionId,
          message: "Successfully joined auction room" 
        });

        // Broadcast updated audience count
        emitAudienceUpdate(io, auctionId);
      } catch (error) {
        logger.error(`Error joining auction: ${error.message}`);
        socket.emit("auctionError", { message: "Failed to join auction" });
      }
    });

    // Handle leaveAuction event
    socket.on("leaveAuction", async (data) => {
      try {
        const { auctionId } = data;

        if (!auctionId) {
          socket.emit("auctionError", { message: "Auction ID is required" });
          return;
        }

        socket.currentAuctionId = null; // Clear tracked auction
        logger.info(`User ${socket.user.id} left auction room: ${room}`);

        socket.emit("leftAuction", { 
          success: true, 
          auctionId,
          message: "Successfully left auction room" 
        });

        // Broadcast updated audience count
        emitAudienceUpdate(io, auctionId);
      } catch (error) {
        logger.error(`Error leaving auction: ${error.message}`);
        socket.emit("auctionError", { message: "Failed to leave auction" });
      }
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Client disconnected from auction namespace: socketId=${socket.id}, reason=${reason}`);

      // Update audience count for the auction this socket was viewing
      if (socket.currentAuctionId) {
        // Emit audience update after a small delay to ensure socket is fully disconnected
        setImmediate(() => {
          emitAudienceUpdate(io, socket.currentAuctionId);
        });
      }
    });
  });

  logger.info("Auction namespace initialized at /auction");
};
