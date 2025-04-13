# PubliShelf

PubliShelf is an online platform for book and magazine transactions, including antique auctions. It provides a seamless interface for buyers, publishers, and administrators to interact and manage their respective functionalities.

---

## Features

- **Buyer Dashboard**: View and purchase books, manage profiles, and participate in auctions.
- **Publisher Dashboard**: Publish books, manage inventory, and track sales.
- **Admin Dashboard**: Oversee platform activities and manage users.
- **Antique Auctions**: Bid on rare and antique items.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Prerequisites

Before starting the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [SQLite3](https://www.sqlite.org/index.html) (for database management)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/PubliShelf.git
   cd PubliShelf
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```env
     PORT=3000
     SECRET=your_secret_key
     ```

4. Initialize the database:

   The application will automatically create and populate the database with mock data on the first run.

---

## Starting the Application

1. Run the application:

   ```bash
   npm start
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## Folder Structure

```
PubliShelf/
├── public/
│   ├── assets/          # Images and static assets
│   ├── css/             # Stylesheets
│   ├── database/        # SQLite database and scripts
│   ├── js/              # Client-side JavaScript
│   ├── mockData/        # Mock data for testing
├── server/
│   ├── config/          # Server configuration files
│   ├── routes/          # API routes
├── views/               # EJS templates for rendering pages
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
├── server.js            # Main server file
```

---

## Scripts

- **Start the server**: `npm start`
- **Run in development mode**: `npm run dev`
- **Lint the code**: `npm run lint`

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or support, please contact the me