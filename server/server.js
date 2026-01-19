import 'dotenv/config'
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { UAParser } from 'ua-parser-js';
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { PORT, MONGODB_URI, CLIENT_URL } from "./config/env.js";

import buyerRoutes from "./routes/buyer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publisherRoutes from "./routes/publisher.routes.js";
import managerRoutes from "./routes/manager.routes.js";
import authRoutes from "./routes/auth.routes.js";
import systemRoutes from "./routes/system.routes.js";

connectDB(MONGODB_URI);

const app = express();

morgan.token('device', (req) => {
  const ua = new UAParser(req.headers['user-agent']);
  const device = ua.getDevice();
  return device.model ? `${device.vendor || ''} ${device.model}`.trim() : 'Desktop';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :device'));

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

app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on port ${PORT}`) });