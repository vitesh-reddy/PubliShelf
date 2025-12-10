import mongoose from "mongoose";
import Book from "../models/Book.model.js";
import fs from "fs";
import path from "path";

const LOG_FILE = path.resolve(process.cwd(), "index-benchmark-final.txt");

function log(msg) {
  fs.appendFileSync(LOG_FILE, msg + "\n");
  console.log(msg);
}

async function clearIndexes() {
  const indexes = await Book.collection.indexes();
  for (const idx of indexes) {
    if (idx.name !== "_id_") {
      await Book.collection.dropIndex(idx.name).catch(() => {});
    }
  }
}

async function runTest(label, query) {
  const explain = await Book.collection.find(query).explain("executionStats");
  const s = explain.executionStats;

  log(
    `${label} → time=${s.executionTimeMillis}ms | keys=${s.totalKeysExamined} | docs=${s.totalDocsExamined}`
  );
}

async function runBenchmark() {
  await mongoose.connect("mongodb://127.0.0.1:27017/PubliShelf");

  fs.appendFileSync(LOG_FILE, `\n\n===== BENCHMARK RUN (${new Date().toISOString()}) =====\n`);

  const prefix = "the ";
  const anchored = { $regex: `^${prefix}`, $options: "i" };
  const keyword = "science machine the war love story magic";

  // --------------------------
  // TEST 1: Pure Prefix Index Test
  // --------------------------
  log("\n--- TEST 1: PURE INDEX PREFIX TEST ---");

  await clearIndexes();

  // (A) No index
  await runTest("NO INDEX - TITLE", { title: anchored });

  // (B) Title index only
  await Book.collection.createIndex({ title: 1 });
  await runTest("TITLE INDEX - TITLE", { title: anchored });
  await clearIndexes();

  // (C) Author index only
  await Book.collection.createIndex({ author: 1 });
  await runTest("AUTHOR INDEX - AUTHOR", { author: anchored });
  await clearIndexes();

  // (D) Genre index only
  await Book.collection.createIndex({ genre: 1 });
  await runTest("GENRE INDEX - GENRE", { genre: anchored });
  await clearIndexes();



  // --------------------------
  // TEST 2: Real-World OR Search
  // --------------------------
  log("\n--- TEST 2: REAL PRODUCTION SEARCH (OR + regex) ---");

  const orQuery = {
    $or: [
      { title: anchored },
      { author: anchored },
      { genre: anchored }
    ]
  };

  await clearIndexes();
  await runTest("NO INDEX - OR QUERY", orQuery);

  await Book.collection.createIndex({ title: 1 });
  await runTest("TITLE INDEX - OR QUERY", orQuery);
  await clearIndexes();

  await Book.collection.createIndex({ author: 1 });
  await runTest("AUTHOR INDEX - OR QUERY", orQuery);
  await clearIndexes();

  await Book.collection.createIndex({ genre: 1 });
  await runTest("GENRE INDEX - OR QUERY", orQuery);
  await clearIndexes();

  await Book.collection.createIndex({ title: 1, author: 1, genre: 1 });
  await runTest("COMPOUND INDEX - OR QUERY", orQuery);
  await clearIndexes();



  // --------------------------
  // TEST 3: FULL-TEXT INDEX SEARCH
  // --------------------------
  log("\n--- TEST 3: FULL-TEXT SEARCH ($text) ---");

  await clearIndexes();

  await runTest("NO INDEX - TEXT SEARCH", { $text: { $search: keyword } }).catch(() => {
    log("TEXT SEARCH FAILED: No text index.");
  });

  await Book.collection.createIndex({
    title: "text",
    author: "text",
    genre: "text"
  });

  await runTest("TEXT INDEX - TEXT SEARCH", { $text: { $search: keyword } });

  await clearIndexes();


  log("\nBenchmark Completed.\n");
  await mongoose.disconnect();
}

runBenchmark();
