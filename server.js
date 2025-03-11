import express from "express";
import path from "path";
import { fileURLToPath } from "url";
console.clear();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import mockBuyerData from "./public/mockBuyerData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import publisherRoutes from "./server/routes/publisherRoutes.js";
import signupRouter from "./server/routes/signupRoutes.js";
import styles from "./public/css/styles.js";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { books: mockBuyerData, styles: styles });
});

app.get("/auth/login", (req, res) => res.render("auth/login"));

app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.use("/auth/signup", signupRouter);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
