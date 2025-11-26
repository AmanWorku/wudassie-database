import express from "express";
import multer from "multer";
import sharp from "sharp";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: (req, file, cb) => {
		// Allow images and audio files
		if (
			file.mimetype.startsWith("image/") ||
			file.mimetype.startsWith("audio/")
		) {
			cb(null, true);
		} else {
			cb(new Error("Only image and audio files are allowed"), false);
		}
	},
});

// Upload image endpoint (with optimization)
router.post("/image", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No image file provided" });
		}

		// Optimize image using sharp
		let optimizedImage;
		if (req.file.mimetype === "image/png") {
			optimizedImage = await sharp(req.file.buffer)
				.resize(2000, 2000, {
					fit: "inside",
					withoutEnlargement: true,
				})
				.png({ quality: 85, compressionLevel: 9 })
				.toBuffer();
		} else {
			optimizedImage = await sharp(req.file.buffer)
				.resize(2000, 2000, {
					fit: "inside",
					withoutEnlargement: true,
				})
				.jpeg({ quality: 85 })
				.toBuffer();
		}

		// Upload to ImageKit
		const fileExtension = req.file.mimetype === "image/png" ? "png" : "jpg";
		const uploadResponse = await imagekit.upload({
			file: optimizedImage,
			fileName: `${uuidv4()}.${fileExtension}`,
			folder: "/hymns/sheet-music/",
		});

		res.json({
			url: uploadResponse.url,
			fileId: uploadResponse.fileId,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({ error: "Failed to upload image" });
	}
});

// Upload multiple images endpoint
router.post("/images", upload.array("images", 3), async (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: "No image files provided" });
		}

		const uploadPromises = req.files.map(async (file) => {
			// Optimize image using sharp
			let optimizedImage;
			if (file.mimetype === "image/png") {
				optimizedImage = await sharp(file.buffer)
					.resize(2000, 2000, {
						fit: "inside",
						withoutEnlargement: true,
					})
					.png({ quality: 85, compressionLevel: 9 })
					.toBuffer();
			} else {
				optimizedImage = await sharp(file.buffer)
					.resize(2000, 2000, {
						fit: "inside",
						withoutEnlargement: true,
					})
					.jpeg({ quality: 85 })
					.toBuffer();
			}

			// Upload to ImageKit
			const fileExtension = file.mimetype === "image/png" ? "png" : "jpg";
			return imagekit.upload({
				file: optimizedImage,
				fileName: `${uuidv4()}.${fileExtension}`,
				folder: "/hymns/sheet-music/",
			});
		});

		const uploadResponses = await Promise.all(uploadPromises);

		res.json({
			urls: uploadResponses.map((response) => response.url),
			fileIds: uploadResponses.map((response) => response.fileId),
		});
	} catch (error) {
		console.error("Error uploading images:", error);
		res.status(500).json({ error: "Failed to upload images" });
	}
});

// Upload audio endpoint
router.post("/audio", upload.single("audio"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No audio file provided" });
		}

		// Upload to ImageKit (ImageKit supports audio files)
		const uploadResponse = await imagekit.upload({
			file: req.file.buffer,
			fileName: `${uuidv4()}.${req.file.originalname.split(".").pop()}`,
			folder: "/hymns/audio/",
		});

		res.json({
			url: uploadResponse.url,
			fileId: uploadResponse.fileId,
		});
	} catch (error) {
		console.error("Error uploading audio:", error);
		res.status(500).json({ error: "Failed to upload audio" });
	}
});

export default router;

