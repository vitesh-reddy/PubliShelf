import express from "express";
import mockPublisherData from "../../public/mockData/mockPublisherData.js";
import { BuyerLoginData } from "../../public/mockData/MockUserData.js";
import db from "../../public/database/db.js";

const router = express.Router();

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("publisher/dashboard", {
      sales: mockPublisherData,
      PublisherName: req.user.firstname,
    });
  } else res.redirect("/auth/login");
});
router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/signup-publisher");
});

router.get("/publish-book", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("publisher/publishBook");
  } else res.redirect("/auth/login");
});

router.get("/sell-antique", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("publisher/sellAntique");
  } else res.redirect("/auth/login");
});


router.post("/signup", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const publishingHouse = req.body.publishingHouse;
  const businessEmail = req.body.businessEmail;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find(
    (Copy) => businessEmail == Copy.email
  );

  if (BuyerRegisterCopy != undefined) {
    res.redirect("/auth/login");
  } else {
    const copyy = {
      id: BuyerLoginData.length + 1,
      role: "publisher",
      firstname: firstname,
      lastname: lastname,
      housename: publishingHouse,
      email: businessEmail,
      password: password,
    };
    BuyerLoginData.push(copyy);
    res.redirect("/auth/login");
  }
});

router.post("/publish-book", (req, res) => {
  const { bookTitle, author, description, genre, price, quantity, image } =
    req.body;
  const parsedQuantity = parseInt(quantity, 10);

  db.get(
    "SELECT * FROM books WHERE bookTitle = ? AND author = ? AND description = ? AND genre = ? AND price = ? AND image = ?",
    [bookTitle, author, description, genre, price, image],
    (err, existingBook) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send("Internal Server Error");
      }

      if (!existingBook) {
        const insertQuery = `INSERT INTO books (bookTitle, author, description, genre, price, quantity, image, rating) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(
          insertQuery,
          [
            bookTitle,
            author,
            description,
            genre,
            price,
            parsedQuantity,
            image,
            4,
          ],
          (err) => {
            if (err) {
              console.error("Error inserting book:", err.message);
              return res.status(500).send("Failed to publish book.");
            }
            console.log("New book published:", bookTitle);
            res.redirect("/publisher/dashboard");
          }
        );
      } else {
        const newQuantity = existingBook.quantity + parsedQuantity;
        db.run(
          "UPDATE books SET quantity = ? WHERE id = ?",
          [newQuantity, existingBook.id],
          (err) => {
            if (err) {
              console.error("Error updating book quantity:", err.message);
              return res.status(500).send("Failed to update book quantity.");
            }
            console.log(
              `Updated quantity for book: ${bookTitle} (New quantity: ${newQuantity})`
            );
            res.redirect("/publisher/dashboard");
          }
        );
      }
    }
  );
});
export default router;
