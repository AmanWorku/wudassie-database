import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to JSON files
const HAGERIGNA_PATH = path.join(__dirname, "../database/HagerignaData.json");
const SDA_PATH = path.join(__dirname, "../database/SDA_Hymnal.json");

// Helper function to read JSON file
async function readJSONFile(filePath) {
	try {
		const data = await fs.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error);
		throw new Error("Failed to read data file");
	}
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
	try {
		await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
	} catch (error) {
		console.error(`Error writing file ${filePath}:`, error);
		throw new Error("Failed to write data file");
	}
}

// GET /api/hagerigna - Get all Hagerigna hymns
router.get("/hagerigna", async (req, res) => {
	try {
		const data = await readJSONFile(HAGERIGNA_PATH);

		// Find the arrays by their _name attributes
		const artistArray =
			data.resources?.array?.find((arr) => arr._name === "song_author_text")
				?.item || [];
		const songArray =
			data.resources?.array?.find((arr) => arr._name === "song_text")?.item ||
			[];
		const titleArray =
			data.resources?.array?.find((arr) => arr._name === "song_title_text")
				?.item || [];

		// Combine the arrays into hymn objects
		const maxLength = Math.max(
			artistArray.length,
			songArray.length,
			titleArray.length
		);
		const hymns = [];

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

// GET /api/sda - Get all SDA hymns
router.get("/sda", async (req, res) => {
	try {
		const data = await readJSONFile(SDA_PATH);

		// Find the arrays by their _name attributes
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

		// Combine the arrays into hymn objects
		const maxLength = Math.max(
			newTitleArray.length,
			oldTitleArray.length,
			newLyricsArray.length,
			englishTitleArray.length,
			oldLyricsArray.length
		);
		const hymns = [];

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

// PUT /api/hagerigna/:id - Update a Hagerigna hymn
router.put("/hagerigna/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { artist, song, title } = req.body;

		// Extract index from ID
		const index = parseInt(id.replace("hagerigna-", ""));

		const data = await readJSONFile(HAGERIGNA_PATH);

		// Find the arrays by their _name attributes
		const artistArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_author_text"
		);
		const songArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_text"
		);
		const titleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_title_text"
		);

		if (!artistArrayObj || !songArrayObj || !titleArrayObj) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		const maxLength = Math.max(
			artistArrayObj.item.length,
			songArrayObj.item.length,
			titleArrayObj.item.length
		);

		if (index < 0 || index >= maxLength) {
			return res.status(404).json({ error: "Hymn not found" });
		}

		// Update the arrays
		artistArrayObj.item[index] = artist;
		songArrayObj.item[index] = song;
		titleArrayObj.item[index] = title;

		await writeJSONFile(HAGERIGNA_PATH, data);

		res.json({
			id,
			artist,
			song,
			title,
		});
	} catch (error) {
		console.error("Error updating Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to update Hagerigna hymn" });
	}
});

// PUT /api/sda/:id - Update an SDA hymn
router.put("/sda/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const {
			newHymnalTitle,
			oldHymnalTitle,
			newHymnalLyrics,
			englishTitleOld,
			oldHymnalLyrics,
		} = req.body;

		// Extract index from ID
		const index = parseInt(id.replace("sda-", ""));

		const data = await readJSONFile(SDA_PATH);

		// Find the arrays by their _name attributes
		const newTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_forbookmark"
		);
		const oldTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_title_forbookmark"
		);
		const newLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_song"
		);
		const englishTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_en"
		);
		const oldLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_song"
		);

		if (
			!newTitleArrayObj ||
			!oldTitleArrayObj ||
			!newLyricsArrayObj ||
			!englishTitleArrayObj ||
			!oldLyricsArrayObj
		) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		const maxLength = Math.max(
			newTitleArrayObj.item.length,
			oldTitleArrayObj.item.length,
			newLyricsArrayObj.item.length,
			englishTitleArrayObj.item.length,
			oldLyricsArrayObj.item.length
		);

		if (index < 0 || index >= maxLength) {
			return res.status(404).json({ error: "Hymn not found" });
		}

		// Update the arrays
		newTitleArrayObj.item[index] = newHymnalTitle;
		oldTitleArrayObj.item[index] = oldHymnalTitle;
		newLyricsArrayObj.item[index] = newHymnalLyrics;
		englishTitleArrayObj.item[index] = englishTitleOld;
		oldLyricsArrayObj.item[index] = oldHymnalLyrics;

		await writeJSONFile(SDA_PATH, data);

		res.json({
			id,
			newHymnalTitle,
			oldHymnalTitle,
			newHymnalLyrics,
			englishTitleOld,
			oldHymnalLyrics,
		});
	} catch (error) {
		console.error("Error updating SDA hymn:", error);
		res.status(500).json({ error: "Failed to update SDA hymn" });
	}
});

// POST /api/hagerigna - Add a new Hagerigna hymn
router.post("/hagerigna", async (req, res) => {
	try {
		const { artist, song, title } = req.body;

		const data = await readJSONFile(HAGERIGNA_PATH);

		// Find the arrays by their _name attributes
		const artistArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_author_text"
		);
		const songArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_text"
		);
		const titleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_title_text"
		);

		if (!artistArrayObj || !songArrayObj || !titleArrayObj) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		// Add new items to arrays
		artistArrayObj.item.push(artist);
		songArrayObj.item.push(song);
		titleArrayObj.item.push(title);

		await writeJSONFile(HAGERIGNA_PATH, data);

		const newId = `hagerigna-${artistArrayObj.item.length - 1}`;

		res.status(201).json({
			id: newId,
			artist,
			song,
			title,
		});
	} catch (error) {
		console.error("Error adding Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to add Hagerigna hymn" });
	}
});

// POST /api/sda - Add a new SDA hymn
router.post("/sda", async (req, res) => {
	try {
		const {
			newHymnalTitle,
			oldHymnalTitle,
			newHymnalLyrics,
			englishTitleOld,
			oldHymnalLyrics,
		} = req.body;

		const data = await readJSONFile(SDA_PATH);

		// Find the arrays by their _name attributes
		const newTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_forbookmark"
		);
		const oldTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_title_forbookmark"
		);
		const newLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_song"
		);
		const englishTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_en"
		);
		const oldLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_song"
		);

		if (
			!newTitleArrayObj ||
			!oldTitleArrayObj ||
			!newLyricsArrayObj ||
			!englishTitleArrayObj ||
			!oldLyricsArrayObj
		) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		// Add new items to arrays
		newTitleArrayObj.item.push(newHymnalTitle);
		oldTitleArrayObj.item.push(oldHymnalTitle);
		newLyricsArrayObj.item.push(newHymnalLyrics);
		englishTitleArrayObj.item.push(englishTitleOld);
		oldLyricsArrayObj.item.push(oldHymnalLyrics);

		await writeJSONFile(SDA_PATH, data);

		const newId = `sda-${newTitleArrayObj.item.length - 1}`;

		res.status(201).json({
			id: newId,
			newHymnalTitle,
			oldHymnalTitle,
			newHymnalLyrics,
			englishTitleOld,
			oldHymnalLyrics,
		});
	} catch (error) {
		console.error("Error adding SDA hymn:", error);
		res.status(500).json({ error: "Failed to add SDA hymn" });
	}
});

// DELETE /api/hagerigna/:id - Delete a Hagerigna hymn
router.delete("/hagerigna/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Extract index from ID
		const index = parseInt(id.replace("hagerigna-", ""));

		const data = await readJSONFile(HAGERIGNA_PATH);

		// Find the arrays by their _name attributes
		const artistArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_author_text"
		);
		const songArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_text"
		);
		const titleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "song_title_text"
		);

		if (!artistArrayObj || !songArrayObj || !titleArrayObj) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		const maxLength = Math.max(
			artistArrayObj.item.length,
			songArrayObj.item.length,
			titleArrayObj.item.length
		);

		if (index < 0 || index >= maxLength) {
			return res.status(404).json({ error: "Hymn not found" });
		}

		// Remove items from arrays
		artistArrayObj.item.splice(index, 1);
		songArrayObj.item.splice(index, 1);
		titleArrayObj.item.splice(index, 1);

		await writeJSONFile(HAGERIGNA_PATH, data);

		res.status(204).send();
	} catch (error) {
		console.error("Error deleting Hagerigna hymn:", error);
		res.status(500).json({ error: "Failed to delete Hagerigna hymn" });
	}
});

// DELETE /api/sda/:id - Delete an SDA hymn
router.delete("/sda/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Extract index from ID
		const index = parseInt(id.replace("sda-", ""));

		const data = await readJSONFile(SDA_PATH);

		// Find the arrays by their _name attributes
		const newTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_forbookmark"
		);
		const oldTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_title_forbookmark"
		);
		const newLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_song"
		);
		const englishTitleArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "new_title_en"
		);
		const oldLyricsArrayObj = data.resources?.array?.find(
			(arr) => arr._name === "old_song"
		);

		if (
			!newTitleArrayObj ||
			!oldTitleArrayObj ||
			!newLyricsArrayObj ||
			!englishTitleArrayObj ||
			!oldLyricsArrayObj
		) {
			return res.status(500).json({ error: "Invalid data structure" });
		}

		const maxLength = Math.max(
			newTitleArrayObj.item.length,
			oldTitleArrayObj.item.length,
			newLyricsArrayObj.item.length,
			englishTitleArrayObj.item.length,
			oldLyricsArrayObj.item.length
		);

		if (index < 0 || index >= maxLength) {
			return res.status(404).json({ error: "Hymn not found" });
		}

		// Remove items from arrays
		newTitleArrayObj.item.splice(index, 1);
		oldTitleArrayObj.item.splice(index, 1);
		newLyricsArrayObj.item.splice(index, 1);
		englishTitleArrayObj.item.splice(index, 1);
		oldLyricsArrayObj.item.splice(index, 1);

		await writeJSONFile(SDA_PATH, data);

		res.status(204).send();
	} catch (error) {
		console.error("Error deleting SDA hymn:", error);
		res.status(500).json({ error: "Failed to delete SDA hymn" });
	}
});

// GET /api/hagerigna/search - Search Hagerigna hymns
router.get("/hagerigna/search", async (req, res) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const data = await readJSONFile(HAGERIGNA_PATH);
		const query = q.toLowerCase();

		// Find the arrays by their _name attributes
		const artistArray =
			data.resources?.array?.find((arr) => arr._name === "song_author_text")
				?.item || [];
		const songArray =
			data.resources?.array?.find((arr) => arr._name === "song_text")?.item ||
			[];
		const titleArray =
			data.resources?.array?.find((arr) => arr._name === "song_title_text")
				?.item || [];

		// Combine the arrays into hymn objects and filter
		const maxLength = Math.max(
			artistArray.length,
			songArray.length,
			titleArray.length
		);
		const filteredHymns = [];

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
				filteredHymns.push(hymn);
			}
		}

		res.json(filteredHymns);
	} catch (error) {
		console.error("Error searching Hagerigna hymns:", error);
		res.status(500).json({ error: "Failed to search Hagerigna hymns" });
	}
});

// GET /api/sda/search - Search SDA hymns
router.get("/sda/search", async (req, res) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const data = await readJSONFile(SDA_PATH);
		const query = q.toLowerCase();

		// Find the arrays by their _name attributes
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

		// Combine the arrays into hymn objects and filter
		const maxLength = Math.max(
			newTitleArray.length,
			oldTitleArray.length,
			newLyricsArray.length,
			englishTitleArray.length,
			oldLyricsArray.length
		);
		const filteredHymns = [];

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
				filteredHymns.push(hymn);
			}
		}

		res.json(filteredHymns);
	} catch (error) {
		console.error("Error searching SDA hymns:", error);
		res.status(500).json({ error: "Failed to search SDA hymns" });
	}
});

export default router;
