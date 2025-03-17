import express from "express";
import mockPublisherData from "../../public/mockData/mockPublisherData.js";
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

import {
  BooksDataArray,
  BuyerLoginData,
} from "../../public/mockData/MockUserData.js";

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
  const { bookTitle, author, description, genre, price, quantity, image } = req.body;
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
        // Insert new book
        const insertQuery = `INSERT INTO books (bookTitle, author, description, genre, price, quantity, image, rating) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertQuery, [bookTitle, author, description, genre, price, parsedQuantity, image, 4], (err) => {
          if (err) {
            console.error("Error inserting book:", err.message);
            return res.status(500).send("Failed to publish book.");
          }
          console.log("New book published:", bookTitle);
          res.redirect("/publisher/dashboard");
        });
      } else {
        // Update quantity if book exists
        const newQuantity = existingBook.quantity + parsedQuantity;
        db.run(
          "UPDATE books SET quantity = ? WHERE id = ?",
          [newQuantity, existingBook.id],
          (err) => {
            if (err) {
              console.error("Error updating book quantity:", err.message);
              return res.status(500).send("Failed to update book quantity.");
            }
            console.log(`Updated quantity for book: ${bookTitle} (New quantity: ${newQuantity})`);
            res.redirect("/publisher/dashboard");
          }
        );
      }
    }
  );
});



// router.post("/publish-book", (req, res) => {
//   const bookTitle = req.body.bookTitle;
//   const author = req.body.author;
//   const description = req.body.description;
//   const genre = req.body.genre;
//   const price = req.body.price;
//   const quantity = parseInt(req.body.quantity, 10);
//   const image = req.body.image;

//   const copyFind = BooksDataArray.find((obj) => {
//     if (
//       bookTitle == obj.bookTitle &&
//       author == obj.author &&
//       description == obj.description &&
//       genre == obj.genre &&
//       price == obj.price &&
//       image == obj.image
//     ) {
//       return obj;
//     }
//   });

//   if (!copyFind) {
//     const BookObject = {
//       id: BooksDataArray.length + 1,
//       bookTitle: bookTitle,
//       author: author,
//       description: description,
//       genre: genre,
//       price: price,
//       quantity: quantity,
//       image: image,
//       rating: 4,
//     };
//     BooksDataArray.push(BookObject);
//   } else {
//     copyFind.quantity = parseInt(copyFind.quantity, 10) + quantity;
//   }

//   console.log(BooksDataArray);
//   res.redirect("/publisher/dashboard");
// });

export default router;