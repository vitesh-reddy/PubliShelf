import express from "express";
import path from "path";
import { fileURLToPath } from "url";
console.clear();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { mockBooks } from "./public/mockData.js";

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { books: mockBooks });
});

app.get("/buyer/dashboard", (req, res) => {
  res.render("buyer/dashboard", { books: mockBooks });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
