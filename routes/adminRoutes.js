import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import styles from "../public/css/styles.js";
<<<<<<< HEAD
import { checkAdminKey } from "../middleware/authMiddleware.js";
import { getAllPublishers, deletePublisherById } from "../services/publisherService.js";
import { getAllBuyers, getAllOrders } from "../services/buyerService.js";
=======
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94

const router = express.Router();

// Admin Signup (No authentication required)
<<<<<<< HEAD
router.get("/signup", (req, res) =>
  res.render("auth/signup-admin", { styles: styles })
);

// Admin Dashboard (Protected Route)
import Book from "../models/Book.js";
import Buyer from "../models/Buyer.js";

router.get("/dashboard/:key", checkAdminKey, async (req, res) => {
  try {
    // Fetch data
    const buyers = await getAllBuyers();
    const orders = await getAllOrders();
    // const auctions = await getAllAuctions();
    const auctions = []; // Placeholder for auctions, replace with actual data fetching
=======
router.get("/signup", (req, res) => res.render("auth/signup-admin", { styles: styles }));

// Admin Dashboard (Protected Route)
import { getAllPublishers } from "../services/publisherService.js";

router.get("/dashboard", protect, async (req, res) => {
  const publishers = await getAllPublishers();
  res.render("admin/dashboard", { publishers });
});
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94

    // Calculate analytics
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
    // Render the dashboard with analytics
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
    await deletePublisherById(publisherId); // Call the service to delete the publisher
    res.status(200).json({ message: "Publisher banned successfully." });
  } catch (error) {
    console.error("Error banning publisher:", error);
    res.status(500).json({ message: "Error banning publisher." });
  }
});

export default router;
