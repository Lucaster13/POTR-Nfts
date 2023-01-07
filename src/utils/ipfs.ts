// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { CIDString, File, NFTStorage } from "nft.storage";

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from "mime";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";

import { NFT_STORAGE_API_KEY } from "./.secrets.js";

// create nft storage
const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 */
async function fileFromPath(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath) as string;
    return new File([content], path.basename(filePath), { type });
}

/**
 * Reads an image file from `imagePath` and stores an NFT
 */
const pinNFT = async (imagePath: string) => {
    // load the file from disk
    const img = await fileFromPath(imagePath);

    // rate limit pin and return cid
    return nftStorage
        .rateLimiter()
        .then(() => console.log("trying to pin", imagePath))
        .then(() => nftStorage.storeBlob(img))
        .then((cid) => {
            console.log("Pin NFT Success", imagePath);
            return cid;
        })
        .catch((e) => console.error(e));
};

// create a new NFTStorage client using API key
const unpinNFT = async (cid: CIDString) => {
    await new Promise(() => console.log("trying to unpin", cid))
        .then(() => nftStorage.check(cid))
        .catch(() => {
            throw new Error(`cid does not exist ${cid}`);
        });

    return nftStorage
        .rateLimiter()
        .then(() => nftStorage.delete(cid))
        .then(() => console.log("UnPin NFT Success", cid))
        .catch((e) => console.error(e));
};

export { pinNFT, unpinNFT };
