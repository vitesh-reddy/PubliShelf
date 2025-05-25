import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import buyerRouter from "./routes/buyerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import styles from "./public/css/styles.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import Book from "./models/Book.js";
import {
  getMetrics,
  getTopSoldBooks,
  getTrendingBooks,
} from "./services/buyerService.js";
import morgan from "morgan";
import Visitor from "./models/Visitor.js";

console.clear();

dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
connectDB(MONGODB_URI);

app.use(morgan("tiny", {
  skip: (req) => req.url.match(/\.(css|js|png|jpg|ico|svg|woff2?)$/)
}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/admin", adminRoutes);

const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',').shift() || 
    req.socket?.remoteAddress || req.connection?.remoteAddress || null
  )}

app.get("/", async (req, res) => {
  try {
    const ip = getClientIP(req);
    const now = new Date();
    const FIVE_MIN = 10 * 60 * 1000;
    
    const visitor = await Visitor.findOne({ ip });     
    if (visitor) {
      const lastVisit = visitor.visitDates[visitor.visitDates.length - 1];
      const timeSinceLastVisit = now - new Date(lastVisit);
    
      if (timeSinceLastVisit > FIVE_MIN) {
        visitor.visitCount += 1;
        visitor.visitDates.push(now);
        await visitor.save();
      }
    } else {
      await Visitor.create({
        ip,
        visitCount: 1,
        visitDates: [now],
      });
    }

    const newlyBooks = await Book.find().sort({ publishedAt: -1 }).limit(8);
    const mostSoldBooks = await getTopSoldBooks();
    const trendingBooks = await getTrendingBooks();

    const metrics = await getMetrics();

    res.render("index", {
      newlyBooks: newlyBooks,
      mostSoldBooks: mostSoldBooks,
      trendingBooks: trendingBooks,
      styles: styles,
      metrics: metrics,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.use("/auth", authRoutes);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.redirect("/");
});

app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
