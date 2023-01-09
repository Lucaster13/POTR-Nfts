import { getCids, getNftStorage, setCid } from "./utils";
import { coinFilesObj } from "./utils/files";

// pins every asset inside /coins folder to ipfs
(async () => {
    const nftStorage = getNftStorage();
    return nftStorage
        .rateLimiter()
        .then(() => console.log(`pinning file(s) from /coins`))
        .then(() => nftStorage.storeDirectory(coinFilesObj))
        .then((cid) => setCid({ coin: cid }))
        .then(() => console.log("Successfully pinned directory", getCids().coin))
        .catch((e) => console.error(e.message));
})();
