import mongoose from "mongoose";

const hagerignaSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		artist: { type: String, default: "" },
		song: { type: String, default: "" },
		title: { type: String, default: "" },
		category: { type: String, default: "" },
		sheet_music: { type: [String], default: [] },
		audio: { type: String, default: "" },
	},
	{ timestamps: true }
);

hagerignaSchema.set("toJSON", {
	virtuals: false,
	transform: (doc, ret) => {
		ret.createdAt = doc.createdAt ? doc.createdAt.toISOString() : ret.createdAt;
		ret.updatedAt = doc.updatedAt ? doc.updatedAt.toISOString() : ret.updatedAt;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

export default mongoose.model("HagerignaHymn", hagerignaSchema);
