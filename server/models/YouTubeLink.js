import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		url: { type: String, required: true },
		videoId: { type: String, default: "" },
		title: { type: String, default: "Unknown" },
		channelTitle: { type: String, default: "" },
		duration: { type: String, default: null },
		thumbnailUrl: { type: String, default: null },
		description: { type: String, default: null },
	},
	{ timestamps: true }
);

// Return plain object with id and createdAt in same shape as JSON API
schema.set("toJSON", {
	virtuals: false,
	transform: (doc, ret) => {
		ret.createdAt = doc.createdAt ? doc.createdAt.toISOString() : ret.createdAt;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

export default mongoose.model("YouTubeLink", schema);
