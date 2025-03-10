import express from "express";
import path from "path";
import { fileURLToPath } from "url";
console.clear();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { mockData } from "./public/mockData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import styles from "./public/css/styles.js";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { books: mockData, styles: styles });
});

app.use("/buyer", buyerRouter);
// app.get("/buyer/dashboard", (req, res) => {
//   res.render("buyer/dashboard", { books: mockData });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
