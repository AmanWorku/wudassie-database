import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readJsonFileOrDefault, writeJsonFile } from "../utils/fileUtils.js";

const router = express.Router();
const YOUTUBE_FILE = "YouTubeLinks.json";

const isYouTubeUrl = (url) => {
	const value = String(url || "").trim();
	return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value);
};

/** Extract video ID from youtube.com/watch?v=ID or youtu.be/ID */
function extractVideoId(url) {
	const u = String(url || "").trim();
	const youtuBe = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	if (youtuBe) return youtuBe[1];
	const watch = u.match(/(?:[?&])v=([a-zA-Z0-9_-]{11})/);
	return watch ? watch[1] : null;
}

/** Parse ISO 8601 duration (e.g. PT4M13S) to human string (e.g. "4:13") */
function parseIsoDuration(iso) {
	if (!iso || typeof iso !== "string") return null;
	const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
	if (!match) return null;
	const hours = parseInt(match[1] || "0", 10);
	const minutes = parseInt(match[2] || "0", 10);
	const seconds = parseInt(match[3] || "0", 10);
	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}
	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Fetch video metadata from YouTube Data API v3 (title, channel, duration, thumbnail) */
async function fetchYoutubeMetadata(videoId, apiKey) {
	if (!apiKey) return null;
	const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
	const res = await fetch(url);
	if (!res.ok) return null;
	const data = await res.json();
	const item = data?.items?.[0];
	if (!item) return null;
	const snippet = item.snippet || {};
	const contentDetails = item.contentDetails || {};
	const thumb = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || null;
	return {
		title: snippet.title || "",
		channelTitle: snippet.channelTitle || "",
		duration: parseIsoDuration(contentDetails.duration) || null,
		thumbnailUrl: thumb,
		description: snippet.description || null,
	};
}

/** Fallback: fetch title and channel from oEmbed (no API key, no duration) */
async function fetchYoutubeOEmbed(videoUrl) {
	const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const data = await res.json();
		return {
			title: data.title || "",
			channelTitle: data.author_name || "",
			duration: null,
			thumbnailUrl: data.thumbnail_url || null,
			description: null,
		};
	} catch {
		return null;
	}
}

const readLinks = async () => {
	const data = await readJsonFileOrDefault(YOUTUBE_FILE, []);
	return Array.isArray(data) ? data : [];
};

router.get("/youtube-links", async (req, res) => {
	try {
		const links = await readLinks();
		res.json(links);
	} catch (error) {
		console.error("Error fetching YouTube links:", error);
		res.status(500).json({ error: "Failed to fetch YouTube links" });
	}
});

router.post("/youtube-links", async (req, res) => {
	try {
		const { url } = req.body || {};
		const videoUrl = url ? String(url).trim() : "";

		if (!videoUrl || !isYouTubeUrl(videoUrl)) {
			return res
				.status(400)
				.json({ error: "Please provide a valid YouTube URL" });
		}

		const videoId = extractVideoId(videoUrl);
		if (!videoId) {
			return res.status(400).json({ error: "Could not extract video ID from URL" });
		}

		const apiKey = process.env.YOUTUBE_API_KEY;
		let metadata = await fetchYoutubeMetadata(videoId, apiKey);
		if (!metadata) {
			metadata = await fetchYoutubeOEmbed(videoUrl);
		}
		if (!metadata) {
			metadata = { title: "", channelTitle: "", duration: null, thumbnailUrl: null, description: null };
		}

		const links = await readLinks();
		const newLink = {
			id: `yt-${uuidv4()}`,
			url: videoUrl,
			videoId: videoId,
			title: metadata.title != null && metadata.title !== "" ? String(metadata.title) : "Unknown",
			channelTitle: metadata.channelTitle != null ? String(metadata.channelTitle) : "",
			duration: metadata.duration != null ? String(metadata.duration) : null,
			thumbnailUrl: metadata.thumbnailUrl != null ? String(metadata.thumbnailUrl) : null,
			description: metadata.description != null ? String(metadata.description) : null,
			createdAt: new Date().toISOString(),
		};

		links.unshift(newLink);
		await writeJsonFile(YOUTUBE_FILE, links);
		console.log("YouTube link saved to JSON:", newLink.id, newLink.title, newLink.channelTitle, newLink.duration ? newLink.duration : "(no duration)");
		res.status(201).json(newLink);
	} catch (error) {
		console.error("Error adding YouTube link:", error);
		res.status(500).json({ error: "Failed to add YouTube link" });
	}
});

router.delete("/youtube-links/:id", async (req, res) => {
	try {
		const links = await readLinks();
		const filtered = links.filter((link) => link.id !== req.params.id);

		if (filtered.length === links.length) {
			return res.status(404).json({ error: "YouTube link not found" });
		}

		await writeJsonFile(YOUTUBE_FILE, filtered);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting YouTube link:", error);
		res.status(500).json({ error: "Failed to delete YouTube link" });
	}
});

export default router;
