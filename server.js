import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mockBuyerData from "./public/mockData/mockBuyerData.js";
import buyerRouter from "./routes/buyerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import "./config/passportConfig.js";
import styles from "./public/css/styles.js";
import { BooksDataArray } from "./public/mockData/MockUserData.js";
import connectDB from "./config/db.js";
import { loginGetController, loginPostController } from "./controllers/authController.js";
console.clear();

dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
connectDB(MONGODB_URI);

app.use(
  session({
    secret: "ULAALAA" || process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    newlyBooks: BooksDataArray,
    books: BooksDataArray,
    styles: styles,
  });
});


app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));

app.get("/auth/login", loginGetController);
app.post("/auth/login", loginPostController);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
