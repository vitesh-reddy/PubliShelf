import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mockBuyerData from "./public/mockData/mockBuyerData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import signupRouter from "./server/routes/signupRoutes.js";
import publisherRoutes from "./server/routes/publisherRoutes.js";
import styles from "./public/css/styles.js";
console.clear();

dotenv.config();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.get("/auth/login", (req, res) => res.render("auth/login"));
app.get("/", (req, res) => res.render("index", { books: mockBuyerData, styles: styles }) );
app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.use("/admin", adminRoutes);
app.use("/auth/signup", signupRouter);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
// app.listen(3000, '10.2.5.95' );
