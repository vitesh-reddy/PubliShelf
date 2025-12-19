import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { PORT, MONGODB_URI, CLIENT_URL } from "./config/env.js";

import buyerRoutes from "./routes/buyer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publisherRoutes from "./routes/publisher.routes.js";
import managerRoutes from "./routes/manager.routes.js";
import authRoutes from "./routes/auth.routes.js";
import systemRoutes from "./routes/system.routes.js";

dotenv.config();
connectDB(MONGODB_URI);

const app = express();

app.use(morgan("tiny", {skip: (req) =>req.url.match(/\.(css|js|png|jpg|ico|svg|woff2?)$/)}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use(cors({origin: CLIENT_URL, credentials: true}));

app.use("/api/buyer", buyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/publisher", publisherRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/auth", authRoutes);
app.use(systemRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));