import fs from "fs";

const OUTPUT_PATH_PREFIX = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/output";

// appends .json file extension to the provided fileName
export default (fileName: string, json: Object) => fs.writeFileSync(`${OUTPUT_PATH_PREFIX}/${fileName}.json`, JSON.stringify(json, null, 2));
