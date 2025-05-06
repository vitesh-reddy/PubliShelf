import express from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { protect } from "../middleware/authMiddleware.js";
import mockPublisherData from "../public/mockData/mockPublisherData.js";
import { BuyerLoginData } from "../public/mockData/MockUserData.js";
import { createPublisher, getPublisherById } from "../services/publisherService.js";

const router = express.Router();


router.get("/dashboard", protect, async (req, res) => {
  const publisher = await getPublisherById(req.user.id);
  res.render("publisher/dashboard", {
    sales: publisher.books,
    PublisherName: req.user.firstname,
  });
});

router.get("/signup", (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      // Redirect logged-in users to their respective dashboard
      if (decoded.role === "publisher") {
        return res.redirect("/publisher/dashboard");
      } else if (decoded.role === "buyer") {
        return res.redirect("/buyer/dashboard");
      }
    } catch (error) {
      // If token is invalid, proceed to signup
    }
  }

  res.render("auth/signup-publisher");
});

router.post("/signup", async (req, res) => {
  const { firstname, lastname, publishingHouse, email, password } = req.body;
  console.log("Inside post", email);
  try {
    // Create a new publisher
    console.log("Inside try", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPublisher = await createPublisher({
      firstname,
      lastname,
      publishingHouse,
      email,
      password: hashedPassword,
    });  
    console.log("Publisher created:", newPublisher);
    // Redirect to login page upon successful signup
    return res.status(201).json({ message: "Publisher account created successfully." });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Error creating publisher", error });
  }
});


// Sell Antique Book (Protected Route)
router.get("/sell-antique", protect, (req, res) => {
  res.render("publisher/sellAntique");
});
// Publisher Signup

router.get("/publish-book", protect, (req, res) => {
  res.render("publisher/publishBook");
});
import { createBook } from "../services/bookService.js";
import { addBookToPublisher } from "../services/publisherService.js";

router.post("/publish-book", protect, async (req, res) => {
  const { title, author, description, genre, price, quantity, image } = req.body;

  const newBook = await createBook({
    title,
    author,
    description,
    genre,
    price,
    quantity,
    image,
    publisher: req.user.id,
  });

  await addBookToPublisher(req.user.id, newBook._id);

  res.status(201).send("Book published successfully");
});

// Publish Book (Protected Route)
router.post("/publish-book", protect, (req, res) => {
  const { bookTitle, author, description, genre, price, quantity, image } = req.body;
  const parsedQuantity = parseInt(quantity, 10);

  // Logic to save the book (e.g., save to database)
  res.sendStatus(201);
});

export default router;
