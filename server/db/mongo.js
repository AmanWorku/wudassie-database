import mongoose from "mongoose";

let isConnected = false;

export function isMongoConnected() {
	return isConnected;
}

export async function connectToMongo() {
	const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
	if (!uri || !uri.startsWith("mongodb")) {
		console.log("📭 No MONGODB_URI set – YouTube links will use JSON file (data won’t persist on Render).");
		return;
	}
	try {
		await mongoose.connect(uri);
		isConnected = true;
		console.log("✅ MongoDB connected – YouTube links will persist.");
	} catch (err) {
		console.error("❌ MongoDB connection failed:", err.message);
	}
}
