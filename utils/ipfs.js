// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { File, NFTStorage } from "nft.storage";

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from "mime";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";

import { NFT_STORAGE_API_KEY } from "../.secrets.js";

/**
  * A helper to read a file from a location on disk and return a File object.
  * Note that this reads the entire file into memory and should not be used for
  * very large files.
*/
async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    return new File([ content ], path.basename(filePath), { type });
}

/**
  * Reads an image file from `imagePath` and stores an NFT
  */
export async function pinNFT(imagePath) {
    // load the file from disk
    const image = await fileFromPath(imagePath);

    // create a new NFTStorage client using API key
    const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    const cid = await nftStorage.storeBlob(image);
    console.log("Pin NFT Success", imagePath);
    return cid;
}

export async function unpinNFT(cid) {
    // create a new NFTStorage client using API key
    const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    await nftStorage.delete(cid);
}
