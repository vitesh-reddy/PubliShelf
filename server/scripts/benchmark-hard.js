import mongoose from "mongoose";
import Book from "../models/Book.model.js";
import fs from "fs";
import path from "path";

const LOG_FILE = path.resolve(process.cwd(), "showcase-index-benchmark.txt");

const log = (msg) => {
  fs.appendFileSync(LOG_FILE, msg + "\n");
  console.log(msg);
};

async function clearIndexes() {
  const indexes = await Book.collection.indexes();
  for (const idx of indexes) {
    if (idx.name !== "_id_") {
      await Book.collection.dropIndex(idx.name).catch(() => {});
    }
  }
}

async function runExplain(label, query) {
  const exp = await Book.collection.find(query).explain("executionStats");
  const s = exp.executionStats;

  const msg =
    `${label} → time=${s.executionTimeMillis}ms | ` +
    `keys=${s.totalKeysExamined} | docs=${s.totalDocsExamined}`;

  log(msg);
}

const showcaseQueries = [
  {
    label: "GENRE FILTER (Thriller)",
    noIndex: { genre: "Thriller" },
    index: { genre: 1 }
  },
  {
    label: "AUTHOR FILTER (Highly Selective)",
    noIndex: { author: "By Time-Life Books" },
    index: { author: 1 }
  },
  {
    label: "COMPOUND FILTER (Mystery + Roberts)",
    noIndex: {
      genre: "Mystery",
      author: "By Roberts, Nora"
    },
    index: { genre: 1, author: 1 }
  },
  {
    label: "PRICE RANGE (Very Narrow)",
    noIndex: {
      price: { $gte: 34500, $lte: 34600 }
    },
    index: { price: 1 }
  },
  {
    label: "SEARCH (regex fallback vs text index)",
    noIndex: {
      $or: [
        { title: /novel/i },
        { author: /novel/i },
        { description: /novel/i }
      ]
    },
    isTextSearch: true,
    textTerm: "novel"
  }
];

async function runBenchmark() {
  await mongoose.connect("mongodb://127.0.0.1:27017/PubliShelf");

  log(`\n===== SHOWCASE BENCHMARK (${new Date().toISOString()}) =====\n`);

  for (const q of showcaseQueries) {
    log(`\n--- TEST: ${q.label} ---\n`);

    // Remove all existing indexes
    await clearIndexes();

    // 1) NO INDEX CASE
    if (!q.isTextSearch) {
      await runExplain(`NO INDEX`, q.noIndex);
    } else {
      try {
        await runExplain(`NO INDEX (regex fallback)`, q.noIndex);
      } catch (err) {
        log(`NO INDEX SEARCH FAILED: ${err.message}`);
      }
    }

    // 2) WITH INDEX CASE
    if (q.isTextSearch) {
      // Build text index
      await Book.collection.createIndex({
        title: "text",
        author: "text",
        description: "text"
      });

      try {
        await runExplain(
          "TEXT INDEX SEARCH",
          { $text: { $search: q.textTerm } }
        );
      } catch (err) {
        log(`TEXT INDEX SEARCH FAILED: ${err.message}`);
      }

    } else {
      // Normal index
      await Book.collection.createIndex(q.index);

      await runExplain(
        `WITH INDEX`,
        q.noIndex
      );
    }
  }

  log("\nBenchmark Completed.");
  await mongoose.disconnect();
}

runBenchmark();
