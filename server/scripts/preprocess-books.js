import fs from "fs";
import csv from "csv-parser";

const inputFile = "./BooksDataset.csv";
const outputFile = "./books-prepared.json";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Romance",
  "Thriller",
  "Other"
];

const IMAGE_URL =
  "https://res.cloudinary.com/dvtpmthha/image/upload/v1764453297/publishelf/books/rmedigfy0dhk3jshkvgi.jpg";

const PUBLISHER_ID = "69386f5115718b86471a188b";

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const start = new Date("2025-02-01");
const end = new Date("2025-11-30");

let output = [];
let firstRow = true;

console.log("Processing CSV...");

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    if (firstRow) {
      console.log("Detected CSV Columns:", Object.keys(row));
      firstRow = false;
    }

    const safe = (v, fallback = "") =>
      v !== undefined && v !== null && String(v).trim() !== "" ? v : fallback;

    // --- FIX PRICE ---
    let rawPrice = safe(row["Price"] || row["price"] || row["Book Price"] || row["Cost"] || "", "0");

    // remove currency symbols, commas, text
    rawPrice = String(rawPrice).replace(/[^0-9.]/g, "");

    let usd = parseFloat(rawPrice);
    if (isNaN(usd)) usd = 0;

    const inr = usd * 85;

    const doc = {
      title: safe(row["Title"], "Untitled Book"),
      author: safe(row["Authors"] || row["Author"], "Unknown Author"),
      description: safe(row["Description"], ""),

      genre: GENRES[Math.floor(Math.random() * GENRES.length)],

      price: inr,

      quantity: Math.floor(Math.random() * (25 - 10 + 1)) + 10,

      image: IMAGE_URL,

      rating: Number((Math.random() * 5).toFixed(1)),

      publisher: PUBLISHER_ID,

      publishedAt: randomDate(start, end),

      isDeleted: false
    };

    output.push(doc);
  })
  .on("end", () => {
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log("✔ Completed!");
    console.log(`✔ Exported ${output.length} books → ${outputFile}`);
  });

//node preprocess-books.js
//mongoimport --uri="mongodb://127.0.0.1:27017/PubliShelf" --collection=books --file=books-prepared.json --jsonArray
