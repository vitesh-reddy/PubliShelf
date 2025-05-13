import AntiqueBook from "../../models/AntiqueBook.js";

const addAntiqueBook = async () => {
  const newAntiqueBook = new AntiqueBook({
    title: "Antique Book Title",
    author: "Author Name",
    description: "This is a rare antique book.",
    genre: "Fiction",
    condition: "Mint",
    basePrice: 100,
    auctionStart: new Date("2025-04-20T10:00:00"),
    auctionEnd: new Date("2025-04-25T10:00:00"),
    images: ["image1.jpg", "image2.jpg"],
    authenticationDocuments: ["doc1.pdf"],
    publisher: "publisherId",
  });

  await newAntiqueBook.save();
  console.log("Antique book added successfully!");
};

addAntiqueBook();
