import fs from "fs";
import { DATA_PATH_PREFIX } from "../constants";

const writeToJson = (json: any, fileName: string) => fs.writeFileSync(`${DATA_PATH_PREFIX}/${fileName}.json`, JSON.stringify(json, null, 2));
const readFromJson = <T>(fileName: string) => JSON.parse(fs.readFileSync(`${DATA_PATH_PREFIX}/${fileName}.json`, "utf-8")) as T;

export { writeToJson, readFromJson };
