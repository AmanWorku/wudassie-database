import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		name: { type: String, required: true, unique: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true },
		description: { type: String, default: "" },
	},
	{ timestamps: true }
);

categorySchema.set("toJSON", {
	virtuals: false,
	transform: (doc, ret) => {
		ret.createdAt = doc.createdAt ? doc.createdAt.toISOString() : ret.createdAt;
		ret.updatedAt = doc.updatedAt ? doc.updatedAt.toISOString() : ret.updatedAt;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

export default mongoose.model("Category", categorySchema);
