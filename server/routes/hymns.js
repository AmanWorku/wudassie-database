import express from "express";
import {
	readJsonFile,
	appendToHagerignaFile,
	appendToSDAFile,
	updateHagerignaFile,
	updateSDAFile,
	deleteFromHagerignaFile,
	deleteFromSDAFile,
} from "../utils/fileUtils.js";

const router = express.Router();

// Get all Hagerigna hymns
router.get("/hagerigna", async (req, res) => {
	try {
		const data = await readJsonFile("HagerignaData.json");
		const artistArray =
			data.resources?.array?.find((arr) => arr._name === "song_author_text")
				?.item || [];
		const songArray =
			data.resources?.array?.find((arr) => arr._name === "song_text")?.item ||
			[];
		const titleArray =
			data.resources?.array?.find((arr) => arr._name === "song_title_text")
				?.item || [];

		const hymns = [];
		const maxLength = Math.max(
			artistArray.length,
			songArray.length,
			titleArray.length
		);

		for (let i = 0; i < maxLength; i++) {
			hymns.push({
				id: `hagerigna-${i}`,
				artist: artistArray[i] || "",
				song: songArray[i] || "",
				title: titleArray[i] || "",
			});
		}

		res.json(hymns);
	} catch (error) {
		console.error("Error fetching Hagerigna hymns:", error);
		res.status(500).json({ error: "Failed to fetch Hagerigna hymns" });
	}
});

// Get all SDA hymns
router.get("/sda", async (req, res) => {
	try {
		const data = await readJsonFile("SDA_Hymnal.json");
		const newTitleArray =
			data.resources?.array?.find(
				(arr) => arr._name === "new_title_forbookmark"
			)?.item || [];
		const oldTitleArray =
			data.resources?.array?.find(
				(arr) => arr._name === "old_title_forbookmark"
			)?.item || [];
		const newLyricsArray =
			data.resources?.array?.find((arr) => arr._name === "new_song")?.item ||
			[];
		const englishTitleArray =
			data.resources?.array?.find((arr) => arr._name === "new_title_en")
				?.item || [];
		const oldLyricsArray =
			data.resources?.array?.find((arr) => arr._name === "old_song")?.item ||
			[];

		const hymns = [];
		const maxLength = Math.max(
			newTitleArray.length,
			oldTitleArray.length,
			newLyricsArray.length,
			englishTitleArray.length,
			oldLyricsArray.length
		);

		for (let i = 0; i < maxLength; i++) {
			hymns.push({
				id: `sda-${i}`,
				newHymnalTitle: newTitleArray[i] || "",
				oldHymnalTitle: oldTitleArray[i] || "",
				newHymnalLyrics: newLyricsArray[i] || "",
				englishTitleOld: englishTitleArray[i] || "",
				oldHymnalLyrics: oldLyricsArray[i] || "",
			});
		}

		res.json(hymns);
	} catch (error) {
		console.error("Error fetching SDA hymns:", error);
		res.status(500).json({ error: "Failed to fetch SDA hymns" });
	}
});

// Add new Hagerigna hymn
router.post("/hagerigna", async (req, res) => {
	try {
		const savedHymn = await appendToHagerignaFile(req.body);
		res.status(201).json(savedHymn);
	} catch (error) {
		console.error("Error adding Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to add Hagerigna hymn" });
	}
});

// Add new SDA hymn
router.post("/sda", async (req, res) => {
	try {
		const savedHymn = await appendToSDAFile(req.body);
		res.status(201).json(savedHymn);
	} catch (error) {
		console.error("Error adding SDA hymn:", error);
		res.status(500).json({ error: "Failed to add SDA hymn" });
	}
});

// Update Hagerigna hymn
router.put("/hagerigna/:id", async (req, res) => {
	try {
		const updatedHymn = await updateHagerignaFile(req.params.id, req.body);
		res.json(updatedHymn);
	} catch (error) {
		console.error("Error updating Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to update Hagerigna hymn" });
	}
});

// Update SDA hymn
router.put("/sda/:id", async (req, res) => {
	try {
		const updatedHymn = await updateSDAFile(req.params.id, req.body);
		res.json(updatedHymn);
	} catch (error) {
		console.error("Error updating SDA hymn:", error);
		res.status(500).json({ error: "Failed to update SDA hymn" });
	}
});

// Delete Hagerigna hymn
router.delete("/hagerigna/:id", async (req, res) => {
	try {
		await deleteFromHagerignaFile(req.params.id);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to delete Hagerigna hymn" });
	}
});

// Delete SDA hymn
router.delete("/sda/:id", async (req, res) => {
	try {
		await deleteFromSDAFile(req.params.id);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting SDA hymn:", error);
		res.status(500).json({ error: "Failed to delete SDA hymn" });
	}
});

// Search Hagerigna hymns
router.get("/hagerigna/search", async (req, res) => {
	try {
		const { q } = req.query;
		const data = await readJsonFile("HagerignaData.json");
		const artistArray =
			data.resources?.array?.find((arr) => arr._name === "song_author_text")
				?.item || [];
		const songArray =
			data.resources?.array?.find((arr) => arr._name === "song_text")?.item ||
			[];
		const titleArray =
			data.resources?.array?.find((arr) => arr._name === "song_title_text")
				?.item || [];

		const hymns = [];
		const maxLength = Math.max(
			artistArray.length,
			songArray.length,
			titleArray.length
		);
		const query = String(q).toLowerCase();

		for (let i = 0; i < maxLength; i++) {
			const hymn = {
				id: `hagerigna-${i}`,
				artist: artistArray[i] || "",
				song: songArray[i] || "",
				title: titleArray[i] || "",
			};

			if (
				hymn.artist.toLowerCase().includes(query) ||
				hymn.song.toLowerCase().includes(query) ||
				hymn.title.toLowerCase().includes(query)
			) {
				hymns.push(hymn);
			}
		}

		res.json(hymns);
	} catch (error) {
		console.error("Error searching Hagerigna hymns:", error);
		res.status(500).json({ error: "Failed to search Hagerigna hymns" });
	}
});

// Search SDA hymns
router.get("/sda/search", async (req, res) => {
	try {
		const { q } = req.query;
		const data = await readJsonFile("SDA_Hymnal.json");
		const newTitleArray =
			data.resources?.array?.find(
				(arr) => arr._name === "new_title_forbookmark"
			)?.item || [];
		const oldTitleArray =
			data.resources?.array?.find(
				(arr) => arr._name === "old_title_forbookmark"
			)?.item || [];
		const newLyricsArray =
			data.resources?.array?.find((arr) => arr._name === "new_song")?.item ||
			[];
		const englishTitleArray =
			data.resources?.array?.find((arr) => arr._name === "new_title_en")
				?.item || [];
		const oldLyricsArray =
			data.resources?.array?.find((arr) => arr._name === "old_song")?.item ||
			[];

		const hymns = [];
		const maxLength = Math.max(
			newTitleArray.length,
			oldTitleArray.length,
			newLyricsArray.length,
			englishTitleArray.length,
			oldLyricsArray.length
		);
		const query = String(q).toLowerCase();

		for (let i = 0; i < maxLength; i++) {
			const hymn = {
				id: `sda-${i}`,
				newHymnalTitle: newTitleArray[i] || "",
				oldHymnalTitle: oldTitleArray[i] || "",
				newHymnalLyrics: newLyricsArray[i] || "",
				englishTitleOld: englishTitleArray[i] || "",
				oldHymnalLyrics: oldLyricsArray[i] || "",
			};

			if (
				hymn.newHymnalTitle.toLowerCase().includes(query) ||
				hymn.oldHymnalTitle.toLowerCase().includes(query) ||
				hymn.englishTitleOld.toLowerCase().includes(query) ||
				hymn.newHymnalLyrics.toLowerCase().includes(query) ||
				hymn.oldHymnalLyrics.toLowerCase().includes(query)
			) {
				hymns.push(hymn);
			}
		}

		res.json(hymns);
	} catch (error) {
		console.error("Error searching SDA hymns:", error);
		res.status(500).json({ error: "Failed to search SDA hymns" });
	}
});

export default router;
