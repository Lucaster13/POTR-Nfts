import fs from "fs";
import { CIDString } from "nft.storage";
import { makeRateLimiter, pinNFT, writeToJson } from "./utils";

const NFT_PATH_PREFIX = "../nfts";
// pins every asset inside /nfts folder to ipfs
(async () => {
    const imagePaths = fs
        .readdirSync(NFT_PATH_PREFIX)
        .filter((fn) => fn !== ".DS_Store") // sometimes shows up so filter this file
        .sort((a, b) => (a.length < b.length || Number(a.slice(0, 4)) < Number(b.slice(0, 4)) ? 1 : -1)); // sort assets by decreasing power

    const cids: { cid: CIDString; idx: number }[] = [];
    let retryIdxs: number[] = [];

    // rate limit pinning to 30 rps to avoid throttling
    const rateLimitedPinNFT = makeRateLimiter(30).wrap(pinNFT);
    // attempt to pin all assets
    await Promise.all(
        imagePaths.map(async (path, idx) => {
            try {
                // pin to ipfs
                const cid = await rateLimitedPinNFT(`${NFT_PATH_PREFIX}/${path}`);
                // add to cids
                cids.push({ cid, idx });
            } catch (e) {
                // add this index to retries
                retryIdxs.push(idx);
            }
        })
    );

    console.log(`${cids.length} nfts successfully pinned on first pass`);
    console.log(`${retryIdxs.length} nfts failed to pin on first pass`);

    // loop until retryIdxs has no entries
    do {
        await Promise.all(
            retryIdxs.map(async (retryIdx) => {
                try {
                    // pin to ipfs
                    const cid = await rateLimitedPinNFT(`${NFT_PATH_PREFIX}/${imagePaths[retryIdx]}`);
                    // add to cids
                    cids.push({ cid, idx: retryIdx });
                    // remove from retryIdxs
                    retryIdxs = retryIdxs.filter((idxToRemove) => idxToRemove !== retryIdx);
                } catch (e) {
                    // do nothing, this will loop again and attempt to pin the same asset on next pass
                }
            })
        );
        console.log(`${cids.length} nfts successfully pinned during retry`);
        console.log(`${retryIdxs.length} nfts failed to pin during retry`);
    } while (retryIdxs.length !== 0);

    console.log(`${cids.length} nfts pinned successfully`);
    writeToJson("cids", cids);
})();
