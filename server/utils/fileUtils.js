import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "database");

// Ensure data directory exists
const ensureDataDir = async () => {
	try {
		await fs.access(DATA_DIR);
	} catch {
		await fs.mkdir(DATA_DIR, { recursive: true });
	}
};

export const readJsonFile = async (filename) => {
	await ensureDataDir();
	const filePath = path.join(DATA_DIR, filename);
	try {
		const data = await fs.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		if (error.code === "ENOENT") {
			throw new Error(`File ${filename} not found`);
		}
		throw error;
	}
};

export const writeJsonFile = async (filename, data) => {
	await ensureDataDir();
	const filePath = path.join(DATA_DIR, filename);
	await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Helper function to find array by name in the data structure
const findArrayByName = (data, name) => {
	return data.resources?.array?.find((arr) => arr._name === name);
};

// Helper function to get max length of all arrays
const getMaxArrayLength = (arrays) => {
	return Math.max(...arrays.map((arr) => arr.item.length));
};

export const appendToHagerignaFile = async (newHymn) => {
	const data = await readJsonFile("HagerignaData.json");

	const artistArray = findArrayByName(data, "song_author_text");
	const songArray = findArrayByName(data, "song_text");
	const titleArray = findArrayByName(data, "song_title_text");

	if (!artistArray || !songArray || !titleArray) {
		throw new Error("Invalid data structure");
	}

	artistArray.item.push(newHymn.artist || "");
	songArray.item.push(newHymn.song || "");
	titleArray.item.push(newHymn.title || "");

	await writeJsonFile("HagerignaData.json", data);
	return {
		id: `hagerigna-${artistArray.item.length - 1}`,
		...newHymn,
	};
};

export const appendToSDAFile = async (newHymn) => {
	const data = await readJsonFile("SDA_Hymnal.json");

	const newTitleArray = findArrayByName(data, "new_title_forbookmark");
	const oldTitleArray = findArrayByName(data, "old_title_forbookmark");
	const newLyricsArray = findArrayByName(data, "new_song");
	const englishTitleArray = findArrayByName(data, "new_title_en");
	const oldLyricsArray = findArrayByName(data, "old_song");

	if (
		!newTitleArray ||
		!oldTitleArray ||
		!newLyricsArray ||
		!englishTitleArray ||
		!oldLyricsArray
	) {
		throw new Error("Invalid data structure");
	}

	newTitleArray.item.push(newHymn.newHymnalTitle || "");
	oldTitleArray.item.push(newHymn.oldHymnalTitle || "");
	newLyricsArray.item.push(newHymn.newHymnalLyrics || "");
	englishTitleArray.item.push(newHymn.englishTitleOld || "");
	oldLyricsArray.item.push(newHymn.oldHymnalLyrics || "");

	await writeJsonFile("SDA_Hymnal.json", data);
	return {
		id: `sda-${newTitleArray.item.length - 1}`,
		...newHymn,
	};
};

export const updateHagerignaFile = async (id, updatedHymn) => {
	const data = await readJsonFile("HagerignaData.json");
	const index = parseInt(id.replace("hagerigna-", ""));

	const artistArray = findArrayByName(data, "song_author_text");
	const songArray = findArrayByName(data, "song_text");
	const titleArray = findArrayByName(data, "song_title_text");

	if (!artistArray || !songArray || !titleArray) {
		throw new Error("Invalid data structure");
	}

	const maxLength = getMaxArrayLength([artistArray, songArray, titleArray]);
	if (index < 0 || index >= maxLength) {
		throw new Error("Hymn not found");
	}

	if (updatedHymn.artist !== undefined)
		artistArray.item[index] = updatedHymn.artist;
	if (updatedHymn.song !== undefined) songArray.item[index] = updatedHymn.song;
	if (updatedHymn.title !== undefined)
		titleArray.item[index] = updatedHymn.title;

	await writeJsonFile("HagerignaData.json", data);
	return {
		id,
		artist: artistArray.item[index],
		song: songArray.item[index],
		title: titleArray.item[index],
	};
};

export const updateSDAFile = async (id, updatedHymn) => {
	const data = await readJsonFile("SDA_Hymnal.json");
	const index = parseInt(id.replace("sda-", ""));

	const newTitleArray = findArrayByName(data, "new_title_forbookmark");
	const oldTitleArray = findArrayByName(data, "old_title_forbookmark");
	const newLyricsArray = findArrayByName(data, "new_song");
	const englishTitleArray = findArrayByName(data, "new_title_en");
	const oldLyricsArray = findArrayByName(data, "old_song");

	if (
		!newTitleArray ||
		!oldTitleArray ||
		!newLyricsArray ||
		!englishTitleArray ||
		!oldLyricsArray
	) {
		throw new Error("Invalid data structure");
	}

	const maxLength = getMaxArrayLength([
		newTitleArray,
		oldTitleArray,
		newLyricsArray,
		englishTitleArray,
		oldLyricsArray,
	]);
	if (index < 0 || index >= maxLength) {
		throw new Error("Hymn not found");
	}

	if (updatedHymn.newHymnalTitle !== undefined)
		newTitleArray.item[index] = updatedHymn.newHymnalTitle;
	if (updatedHymn.oldHymnalTitle !== undefined)
		oldTitleArray.item[index] = updatedHymn.oldHymnalTitle;
	if (updatedHymn.newHymnalLyrics !== undefined)
		newLyricsArray.item[index] = updatedHymn.newHymnalLyrics;
	if (updatedHymn.englishTitleOld !== undefined)
		englishTitleArray.item[index] = updatedHymn.englishTitleOld;
	if (updatedHymn.oldHymnalLyrics !== undefined)
		oldLyricsArray.item[index] = updatedHymn.oldHymnalLyrics;

	await writeJsonFile("SDA_Hymnal.json", data);
	return {
		id,
		newHymnalTitle: newTitleArray.item[index],
		oldHymnalTitle: oldTitleArray.item[index],
		newHymnalLyrics: newLyricsArray.item[index],
		englishTitleOld: englishTitleArray.item[index],
		oldHymnalLyrics: oldLyricsArray.item[index],
	};
};

export const deleteFromHagerignaFile = async (id) => {
	const data = await readJsonFile("HagerignaData.json");
	const index = parseInt(id.replace("hagerigna-", ""));

	const artistArray = findArrayByName(data, "song_author_text");
	const songArray = findArrayByName(data, "song_text");
	const titleArray = findArrayByName(data, "song_title_text");

	if (!artistArray || !songArray || !titleArray) {
		throw new Error("Invalid data structure");
	}

	const maxLength = getMaxArrayLength([artistArray, songArray, titleArray]);
	if (index < 0 || index >= maxLength) {
		throw new Error("Hymn not found");
	}

	artistArray.item.splice(index, 1);
	songArray.item.splice(index, 1);
	titleArray.item.splice(index, 1);

	await writeJsonFile("HagerignaData.json", data);
};

export const deleteFromSDAFile = async (id) => {
	const data = await readJsonFile("SDA_Hymnal.json");
	const index = parseInt(id.replace("sda-", ""));

	const newTitleArray = findArrayByName(data, "new_title_forbookmark");
	const oldTitleArray = findArrayByName(data, "old_title_forbookmark");
	const newLyricsArray = findArrayByName(data, "new_song");
	const englishTitleArray = findArrayByName(data, "new_title_en");
	const oldLyricsArray = findArrayByName(data, "old_song");

	if (
		!newTitleArray ||
		!oldTitleArray ||
		!newLyricsArray ||
		!englishTitleArray ||
		!oldLyricsArray
	) {
		throw new Error("Invalid data structure");
	}

	const maxLength = getMaxArrayLength([
		newTitleArray,
		oldTitleArray,
		newLyricsArray,
		englishTitleArray,
		oldLyricsArray,
	]);
	if (index < 0 || index >= maxLength) {
		throw new Error("Hymn not found");
	}

	newTitleArray.item.splice(index, 1);
	oldTitleArray.item.splice(index, 1);
	newLyricsArray.item.splice(index, 1);
	englishTitleArray.item.splice(index, 1);
	oldLyricsArray.item.splice(index, 1);

	await writeJsonFile("SDA_Hymnal.json", data);
};
