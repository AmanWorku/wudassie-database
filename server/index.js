import express from "express";
import cors from "cors";
import helmet from "helmet";
import songRoutes from "./routes/songs.js";
import hymnRoutes from "./routes/hymns.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
		crossOriginOpenerPolicy: { policy: "unsafe-none" },
	})
);

// CORS configuration
app.use(
	cors({
		origin: "*", // Allow all origins for GET requests
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/songs", songRoutes);
app.use("/api", hymnRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Music Database API is running" });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`🎵 Music Database API running on port ${PORT}`);
});
