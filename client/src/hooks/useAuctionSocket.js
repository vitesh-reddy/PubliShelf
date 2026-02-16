// client/src/hooks/useAuctionSocket.js
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createAuctionSocket } from "../utils/socket.util.js";
import { getAuctionOngoing } from "../services/antiqueBook.services.js";

export const useAuctionSocket = ({ 
  auctionId, 
  user, 
  onNewBid, 
  onAudienceUpdate,
  enabled = true 
}) => {
  const [audienceCount, setAudienceCount] = useState(0);
  const [isBidding, setIsBidding] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const isPlacingBidRef = useRef(false);
  const hasConnectedRef = useRef(false);
  
  // Use refs for callbacks to avoid dependency issues
  const onNewBidRef = useRef(onNewBid);
  const onAudienceUpdateRef = useRef(onAudienceUpdate);

  // Update refs when callbacks change
  useEffect(() => {
    onNewBidRef.current = onNewBid;
    onAudienceUpdateRef.current = onAudienceUpdate;
  }, [onNewBid, onAudienceUpdate]);

  useEffect(() => {
    if (!enabled || !auctionId) return;

    // Initialize Socket.IO connection
    const socket = createAuctionSocket();
    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      const isReconnection = hasConnectedRef.current;
      console.log(isReconnection ? "Socket reconnected" : "Socket connected");
      
      setIsConnected(true);
      hasConnectedRef.current = true;
      
      // Join the auction room
      socket.emit("joinAuction", { auctionId });
      
      // If this is a reconnection, refetch state to recover missed updates
      if (isReconnection) {
        refetchAuctionState();
      }
    });

    socket.on("joinedAuction", (data) => {
      console.log("Joined auction room:", data);
    });

    socket.on("newBid", (data) => {
      console.log("New bid received:", data);
      
      // Call the provided callback with bid data
      if (onNewBidRef.current) {
        onNewBidRef.current({
          currentPrice: data.currentPrice,
          bid: data.bid,
        });
      }
      
      // If this was our bid, show success message and reset bidding state
      if (isPlacingBidRef.current && data.bid.bidder._id === user?._id) {
        toast.success("Bid placed successfully!");
        setIsBidding(false);
        isPlacingBidRef.current = false;
      }
    });

    socket.on("audienceUpdate", (data) => {
      console.log("Audience update:", data);
      setAudienceCount(data.audienceCount);
      
      // Call the provided callback
      if (onAudienceUpdateRef.current) {
        onAudienceUpdateRef.current(data.audienceCount);
      }
    });

    socket.on("auctionError", (data) => {
      console.error("Auction error:", data);
      toast.error(data.message || "An error occurred");
      
      // If we were placing a bid, reset the state
      if (isPlacingBidRef.current) {
        setIsBidding(false);
        isPlacingBidRef.current = false;
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection error. Please refresh the page.");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit("leaveAuction", { auctionId });
        socket.disconnect();
      }
      socketRef.current = null;
      hasConnectedRef.current = false;
      setIsConnected(false);
    };
  }, [auctionId, enabled, user?._id]);

  const refetchAuctionState = async () => {
    try {
      const response = await getAuctionOngoing(auctionId);
      if (response.success && onNewBidRef.current) {
        // Update with the latest bid from server
        const latestBid = response.data.book.biddingHistory?.[0];
        if (latestBid) {
          onNewBidRef.current({
            currentPrice: response.data.book.currentPrice,
            bid: latestBid,
            fullState: response.data.book, // Pass full state for complete recovery
          });
        }
        console.log("Auction state recovered after reconnection");
      }
    } catch (err) {
      console.error("Failed to refetch auction state:", err);
    }
  };


  const placeBid = (bidAmount) => {
    if (!socketRef.current || !socketRef.current.connected) {
      toast.error("Not connected to auction. Please refresh the page.");
      return false;
    }

    setIsBidding(true);
    isPlacingBidRef.current = true;

    try {
      // Emit bid via socket - success/error will be handled by socket listeners
      socketRef.current.emit("placeBid", { 
        auctionId, 
        bidAmount 
      });
      return true;
    } catch (err) {
      toast.error("Error placing bid");
      setIsBidding(false);
      isPlacingBidRef.current = false;
      return false;
    }
  };

  return {
    placeBid,
    audienceCount,
    isBidding,
    isConnected,
  };
};
