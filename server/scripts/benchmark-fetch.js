// import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/books/search-index-benchmark";

// array of keywords for testing
const KEYWORDS = [
  "love",
  "war",
  "death",
  "science",
  "story",
  "magic",
  "space",
  "future",
  "history",
  "machine"
];

async function runBenchmark() {
  console.log("Starting benchmark...\n");

  for (const keyword of KEYWORDS) {
    try {
      // build URL
      const url = `${API_URL}?keywords=${keyword}`;

      // make request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer TOKEN_IF_NEEDED"
        }
      });

      const data = await response.json();

      // simple console log to show progress
      console.log(`Completed keyword: ${keyword} → success=${data.success}`);
    } catch (err) {
      console.error(`Error for keyword "${keyword}":`, err);
    }
  }

  console.log("\nBenchmark finished.");
}

runBenchmark();
