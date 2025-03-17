import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite3 database.");
    }
});


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookTitle TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT NOT NULL,
        genre TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        image TEXT NOT NULL,
        rating INTEGER DEFAULT 4
    )`, (err) => {
        if (err) {
            console.error("Error creating books table:", err.message);
        } else {
            console.log("Books table is ready.");
        }
    });
});

module.exports = db; 
