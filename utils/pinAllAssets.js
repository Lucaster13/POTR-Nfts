import fs from "fs";
import { makeRateLimiter } from "../_common.js";
import { pinNFT } from "./ipfs.js";

(async () => {
    const imagePaths = fs.readdirSync("./nfts")
        .filter((fn) => fn !== ".DS_Store")
        .sort((a, b) => (a.length < b.length || Number(a.slice(0, 4)) < Number(b.slice(0, 4)) ? 1 : -1));

    const cids = [];
    let retryIdxs = [];

    const limiter = makeRateLimiter(30);
    const rateLimitedPinNFT = limiter.wrap(pinNFT);
    // attempt to pin all assets
    await Promise.all(imagePaths.map(async (path, idx) => {
        try {
            // pin to ipfs
            const cid = await rateLimitedPinNFT(`./nfts/${path}`);
            // add to cids
            cids.push({ cid, idx });
        } catch (e) {
            // add this index to retries
            retryIdxs.push({ idx });
        }
    }));

    console.log(`${cids.length} nfts successfully pinned on first pass`);
    console.log(`${retryIdxs.length} nfts failed to pin on first pass`);

    // loop until retryIdxs has no entries
    do {
        await Promise.all(retryIdxs.map(async ({ idx }) => {
            try {
                // pin to ipfs
                const cid = await rateLimitedPinNFT(`./nfts/${imagePaths[idx]}`);
                // add to cids
                cids.push({ cid, idx });
                // remove from retryIdxs
                retryIdxs = retryIdxs.filter(({ idx: idxToRemove }) => idxToRemove !== idx);
            } catch (e) {
                // do nothing, this will loop again and attempt to pin the same asset
            }
        }));
        console.log(`${cids.length} nfts successfully pinned during retry`);
        console.log(`${retryIdxs.length} nfts failed to pin during retry`);
    } while (retryIdxs.length !== 0);

    console.log(`${cids.length} nfts pinned successfully`);
    fs.writeFileSync("cids.json", JSON.stringify(cids, null, 2));
})();
