import express from "express";
import styles from "../public/css/styles.js";
import { checkAdminKey } from "../middleware/authMiddleware.js";
import { getAllPublishers, deletePublisherById } from "../services/publisherService.js";
import { getAllBuyers, getAllOrders } from "../services/buyerService.js";

const router = express.Router();

router.get("/signup", (req, res) =>
  res.render("auth/signup-admin", { styles: styles })
);

import Book from "../models/Book.js";
import Buyer from "../models/Buyer.js";

router.get("/dashboard/:key", checkAdminKey, async (req, res) => {
  try {
    const buyers = await getAllBuyers();
    const orders = await getAllOrders();
    // const auctions = await getAllAuctions();
    const auctions = []; // Placeholder

    const totalBuyers = buyers.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.book.price * order.quantity,
      0
    );
    const activeAuctions = auctions.filter(
      (auction) => auction.status === "ongoing"
    ).length;

    const genreCounts = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $project: { genre: "$_id", count: 1, _id: 0 } },
    ]);

    const revenueByGenre = await Buyer.aggregate([
      { $unwind: "$orders" },
      {
        $lookup: {
          from: "books",
          localField: "orders.book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $group: {
          _id: "$bookDetails.genre",
          revenue: {
            $sum: { $multiply: ["$orders.quantity", "$bookDetails.price"] },
          },
        },
      },
      { $project: { genre: "$_id", revenue: 1, _id: 0 } },
    ]);

    const admin = { name: "Vitesh", email: "admin1@gmail.com" };
    const publishers = await getAllPublishers();
    const analytics = {
      totalBuyers,
      totalOrders,
      totalRevenue,
      activeAuctions,
      genreCounts,
      revenueByGenre,
    };  
    res.render("admin/dashboard", {
      admin,
      publishers,
      activities: [],
      analytics,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).send("Error fetching admin dashboard data");
  }
});

router.delete("/publishers/:id/ban", async (req, res) => {
  try {
    const publisherId = req.params.id;
    await deletePublisherById(publisherId); 
    res.status(200).json({ message: "Publisher banned successfully." });
  } catch (error) {
    console.error("Error banning publisher:", error);
    res.status(500).json({ message: "Error banning publisher." });
  }
});

export default router;
