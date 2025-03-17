import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mockBuyerData from "./public/mockData/mockBuyerData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import publisherRoutes from "./server/routes/publisherRoutes.js";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import "./server/config/passportConfig.js";
import styles from "./public/css/styles.js";
console.clear();

dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

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


// mockBuyerData

app.get("/", (req, res) => {
  res.render("index", { books: BooksDataArray, styles: styles });
});

app.get("/auth/login", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role == "buyer") res.redirect("/buyer/dashboard");
    else if (req.user.role == "publisher") res.redirect("/publisher/dashboard");
    else if (req.user.role == "admin") res.redirect("/admin/dashboard");
    else res.redirect("/manager/dashboard");
  } else res.render("auth/login");
});

app.get("/", (req, res) => {
  res.render("index", { books: mockBuyerData, styles: styles });
});

app.get("/auth/login", (req, res) => res.render("auth/login"));

app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));

app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (info.message == "user not found")
        return res.status(403).json({ key: "user not found" });
      else if (info.message == "incorrect password")
        return res.status(401).json({ key: "incorrect password" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.redirect("/buyer/dashboard");
      return res.status(200);
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
// app.listen(3000, "10.2.5.95", () => {
//   console.log(`server is running at http://10.2.5.95:${PORT}`);
// });
