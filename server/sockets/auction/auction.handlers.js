import logger from "../../config/logger.js";
import { addBid } from "../../services/antiqueBook.services.js";
import { emitNewBid } from "./auction.emitter.js";

export const registerAuctionHandlers = (socket, io) => {
  socket.on("placeBid", async (data) => {
    try {
      const { auctionId, bidAmount } = data;

      // Validate required fields
      if (!auctionId) {
        socket.emit("auctionError", { 
          message: "Auction ID is required",
          field: "auctionId"
        });
        return;
      }

      if (!bidAmount) {
        socket.emit("auctionError", { 
          message: "Bid amount is required",
          field: "bidAmount"
        });
        return;
      }

      logger.info(`User ${socket.user.id} attempting to place bid on auction ${auctionId}: amount=${bidAmount}`);

      // Call existing service
      const updatedBook = await addBid(auctionId, socket.user.id, bidAmount);

      // Extract new bid (last entry)
      const newBid = updatedBook.biddingHistory[updatedBook.biddingHistory.length - 1];

      // Prepare payload
      const payload = {
        auctionId,
        currentPrice: updatedBook.currentPrice,
        bid: {
          _id: newBid._id,
          bidder: newBid.bidder,
          bidAmount: newBid.bidAmount,
          bidTime: newBid.bidTime
        },
        serverTime: new Date()
      };

      // Broadcast to all clients in the auction room
      emitNewBid(io, auctionId, payload);

      logger.info(`Bid placed successfully: user=${socket.user.id}, auction=${auctionId}, amount=${bidAmount}`);
    } catch (error) {
      logger.error(`Error placing bid via socket: ${error.message}`);
      socket.emit("auctionError", { 
        message: error.message || "Failed to place bid"
      });
    }
  });
};
