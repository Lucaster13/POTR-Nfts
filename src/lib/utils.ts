import { filesFromPaths } from "files-from-path";
import fs, { promises as fsPromises } from "fs";
import { DATA_PATH_PREFIX, NFT_PATH_PREFIX } from "../constants/paths";

// READING/WRITING FILES
export const writeToJson = (json: any, fileName: string) =>
	fs.writeFileSync(`${DATA_PATH_PREFIX}/${fileName}.json`, JSON.stringify(json, null, 2));
export const readFromJson = <T>(fileName: string) =>
	JSON.parse(fs.readFileSync(`${DATA_PATH_PREFIX}/${fileName}.json`, "utf-8")) as T;

async function readFileNames(dirname) {
	const fileNames = await filesFromPaths(dirname).then((files) => files.map((f) => f.name));
	return fileNames;
}

async function readFiles(dirname) {
	const fileNames = await readFileNames(dirname);
	const fileBuffers = await Promise.all(
		fileNames.map((filename) => fsPromises.readFile([dirname, filename].join("/")).then((f) => [filename, f])),
	);
	return fileBuffers.map(([filename, fb]) => new File([fb], filename as string, { type: "image/png" }));
}

export const getPotrFiles = () => readFiles(NFT_PATH_PREFIX);
export const getFileName = (potrNum: string | number) => String(potrNum).padStart(4);

// SAFTELY CALL FUNCTION
const SAFE_CALL_IGNORE_ERRORS = ["NFT not found"];
export async function safeCall<T>(rateLimitedFn: () => Promise<T>) {
	const done = false;
	while (!done) {
		try {
			const res = await rateLimitedFn();
			return res as T;
		} catch (e) {
			// skip
			if (SAFE_CALL_IGNORE_ERRORS.includes(e.message)) {
				console.log("ignoring failure:", e.message);
				return;
			}

			console.log("failed:", e.message, "- retrying...");
		}
	}
}
