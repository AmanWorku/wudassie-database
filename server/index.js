import express from "express";
import cors from "cors";
import helmet from "helmet";
import songRoutes from "./routes/songs.js";
import hymnRoutes from "./routes/hymns.js";
import uploadRoutes from "./routes/upload.js";
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

// CORS configuration - Allow all origins
app.use(
	cors({
		origin: true, // This will reflect the request origin
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Accept",
			"Origin",
			"X-Requested-With",
			"X-Platform",
			"X-App-Version",
		],
		exposedHeaders: [
			"Content-Length",
			"Content-Type",
			"X-Platform",
			"X-App-Version",
		],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204,
		maxAge: 86400, // 24 hours
	})
);

// Handle OPTIONS requests
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/songs", songRoutes);
app.use("/api", hymnRoutes);
app.use("/api/upload", uploadRoutes);

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
