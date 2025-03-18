import sqlite3 from "sqlite3";
sqlite3.verbose();

// Connect to SQLite database (or create if not exists)
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite3 database.");
    }
});

// Create 'books' table if not exists
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
        rating REAL DEFAULT 4
    )`, (err) => {
        if (err) {
            console.error("Error creating books table:", err.message);
        } else {
            console.log("Books table is ready.");
            insertMockData(); // Insert data after table creation
        }
    });
});

// Mock Data
const mockBooks = [
    { bookTitle: "Aathma Katha", author: "Vitesh Reddy", description: "A chilling thriller that delves into the dark corners of the mind. Follow the protagonist as they navigate a world filled with secrets, betrayals, and a shadowy past that refuses to stay buried. Each chapter pulls you deeper into a web of suspense, leaving you guessing until the very end.", genre: "Thriller", price: 1090, quantity: 11, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80", rating: 5 },
    { bookTitle: "Mystic Shadows", author: "Liam Carter", description: "A mysterious thriller with unexpected twists.", genre: "Mystery", price: 850, quantity: 7, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80", rating: 4.5 },
    { bookTitle: "Beyond the Stars", author: "Sophia Allen", description: "A sci-fi adventure exploring the unknown universe.", genre: "Science Fiction", price: 1200, quantity: 15, image: "https://images.unsplash.com/photo-1514894780887-121968d00567?w=800&q=80", rating: 4.8 },
    { bookTitle: "The Art of Life", author: "Michael Johnson", description: "A deep dive into the philosophy of happiness.", genre: "Self-Help", price: 650, quantity: 20, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80", rating: 4.2 },
    { bookTitle: "Whispering Winds", author: "Emily Rose", description: "A romantic journey through time and memories.", genre: "Romance", price: 950, quantity: 5, image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80", rating: 4.7 },
    // { bookTitle: "The Hidden Truth", author: "Nathan Harper", description: "A suspense novel that keeps you on the edge.", genre: "Suspense", price: 890, quantity: 8, image: "https://images.unsplash.com/photo-1590502593747-4808d00a5457?w=800&q=80", rating: 4.6 },
    { bookTitle: "Digital Fortress", author: "Dan Brown", description: "A thrilling story about cybersecurity and secrets.", genre: "Tech Thriller", price: 1100, quantity: 12, image: "https://images.unsplash.com/photo-1549388604-817d15aa0110?w=800&q=80", rating: 4.9 },
    // { bookTitle: "The Cosmic Voyage", author: "Eleanor Bright", description: "An exploration of the mysteries of the universe.", genre: "Science", price: 1350, quantity: 9, image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e2?w=800&q=80", rating: 4.8 },
    { bookTitle: "Mind Over Matter", author: "Dr. Henry Ford", description: "A self-help book to boost mental strength.", genre: "Self-Help", price: 720, quantity: 14, image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80", rating: 4.3 },
    // { bookTitle: "Echoes of the Past", author: "Isabella Clarke", description: "A historical fiction novel with gripping storytelling.", genre: "Historical Fiction", price: 990, quantity: 6, image: "https://images.unsplash.com/photo-1529539795054-3c162aab0370?w=800&q=80", rating: 4.7 }
];

// Function to insert mock data if not present
function insertMockData() {
    mockBooks.forEach((book) => {
        db.get("SELECT * FROM books WHERE bookTitle = ? AND author = ?", [book.bookTitle, book.author], (err, row) => {
            if (err) {
                console.error("Error checking book:", err.message);
            } else if (!row) {
                db.run(`INSERT INTO books (bookTitle, author, description, genre, price, quantity, image, rating)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [book.bookTitle, book.author, book.description, book.genre, book.price, book.quantity, book.image, book.rating],
                    (err) => {
                        if (err) {
                            console.error("Error inserting book:", err.message);
                        } else {
                            console.log(`Book "${book.bookTitle}" inserted.`);
                        }
                    }
                );
            } else {
                console.log(`Book "${book.bookTitle}" already exists.`);
            }
        });
    });
}

export default db;