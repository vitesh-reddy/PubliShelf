import mongoose from "mongoose";
import Book from "../models/Book.model.js";
import fs from "fs";
import path from "path";

const LOG_FILE = path.resolve(process.cwd(), "filter-index-benchmark.txt");
const log = (msg) => {
  fs.appendFileSync(LOG_FILE, msg + "\n");
  console.log(msg);
};

async function clearAllIndexes() {
  const indexes = await Book.collection.indexes();
  for (const idx of indexes) {
    if (idx.name !== "_id_") await Book.collection.dropIndex(idx.name).catch(() => {});
  }
}

async function runExplain(label, query) {
  const exp = await Book.collection.find(query).explain("executionStats");
  const s = exp.executionStats;
  const msg = `${label} → time=${s.executionTimeMillis}ms | keys=${s.totalKeysExamined} | docs=${s.totalDocsExamined}`;
  log(msg);
}

async function getDynamicInputs() {
  // 1. genres
  const genres = await Book.distinct("genre");
  const sampleGenres = genres.slice(0, 5); // pick 5

  // 2. authors
  const authors = await Book.distinct("author");
  const sampleAuthors = authors.slice(0, 5);

  // 3. price ranges (dynamic based on min & max from DB)
  const minPriceDoc = await Book.findOne().sort({ price: 1 }).select("price");
  const maxPriceDoc = await Book.findOne().sort({ price: -1 }).select("price");

  const min = minPriceDoc.price;
  const max = maxPriceDoc.price;

  // generate 5 random ranges
  const priceRanges = [];
  for (let i = 0; i < 5; i++) {
    const p1 = Math.floor(min + Math.random() * ((max - min) / 2));
    const p2 = Math.floor(p1 + Math.random() * ((max - p1)));
    priceRanges.push({ min: p1, max: p2 });
  }

  // 4. keywords from titles
  const randomBooks = await Book.aggregate([{ $sample: { size: 10 } }]);
  const keywords = [];

  randomBooks.forEach((b) => {
    if (!b.title) return;
    b.title
      .split(" ")
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 4) // only meaningful words
      .forEach((w) => keywords.push(w));
  });

  return {
    sampleGenres,
    sampleAuthors,
    priceRanges,
    keywords: keywords.slice(0, 10)
  };
}

async function runBenchmark() {
  await mongoose.connect("mongodb://127.0.0.1:27017/PubliShelf");

  fs.appendFileSync(
    LOG_FILE,
    `\n\n===== BENCHMARK RUN (${new Date().toISOString()}) =====\n`
  );

  const { sampleGenres, sampleAuthors, priceRanges, keywords } =
    await getDynamicInputs();

  log(`Dynamic Test Genres: ${JSON.stringify(sampleGenres)}`);
  log(`Dynamic Test Authors: ${JSON.stringify(sampleAuthors)}`);
  log(`Dynamic Price Ranges: ${JSON.stringify(priceRanges)}`);
  log(`Dynamic Keywords: ${JSON.stringify(keywords)}\n`);

  // ########################################
  // TEST 1 — GENRE FILTER
  // ########################################
  log("--- TEST 1: GENRE FILTER ---");

  await clearAllIndexes();

  for (const g of sampleGenres) {
    await runExplain(`NO INDEX - GENRE "${g}"`, { genre: g });
  }

  await Book.collection.createIndex({ genre: 1 });

  for (const g of sampleGenres) {
    await runExplain(`INDEXED - GENRE "${g}"`, { genre: g });
  }

  await clearAllIndexes();

  // ########################################
  // TEST 2 — AUTHOR FILTER
  // ########################################
  log("\n--- TEST 2: AUTHOR FILTER ---");

  for (const a of sampleAuthors) {
    await runExplain(`NO INDEX - AUTHOR "${a}"`, { author: a });
  }

  await Book.collection.createIndex({ author: 1 });

  for (const a of sampleAuthors) {
    await runExplain(`INDEXED - AUTHOR "${a}"`, { author: a });
  }

  await clearAllIndexes();

  // ########################################
  // TEST 3 — PRICE RANGE
  // ########################################
  log("\n--- TEST 3: PRICE RANGE FILTER ---");

  for (const r of priceRanges) {
    await runExplain(
      `NO INDEX - PRICE ${r.min}-${r.max}`,
      { price: { $gte: r.min, $lte: r.max } }
    );
  }

  await Book.collection.createIndex({ price: 1 });

  for (const r of priceRanges) {
    await runExplain(
      `INDEXED - PRICE ${r.min}-${r.max}`,
      { price: { $gte: r.min, $lte: r.max } }
    );
  }

  await clearAllIndexes();

  // ########################################
  // TEST 4 — FULL TEXT SEARCH
  // ########################################
  log("\n--- TEST 4: FULL-TEXT SEARCH ($text) ---");

  // no index
  for (const k of keywords) {
    await runExplain(`NO INDEX - TEXT SEARCH "${k}"`, { $text: { $search: k } })
      .catch(() => log(`TEXT SEARCH FAILED (no index)`));
  }

  // enable text index
  await Book.collection.createIndex({
    title: "text",
    author: "text",
    description: "text",
  });

  for (const k of keywords) {
    await runExplain(`TEXT INDEX - SEARCH "${k}"`, { $text: { $search: k } });
  }

  await clearAllIndexes();

  log("\nBenchmark Completed.\n");
  await mongoose.disconnect();
}

runBenchmark();
