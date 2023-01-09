import { getCids, getNftStorage, setCid } from "./utils";
import { potrFilesObj } from "./utils/files";

// pins every asset inside /nfts folder to ipfs
(async () => {
    const nftStorage = getNftStorage();
    return nftStorage
        .rateLimiter()
        .then(() => console.log(`pinning file(s) from /nfts`))
        .then(() => nftStorage.storeDirectory(potrFilesObj))
        .then((cid) => setCid({ potr: cid }))
        .then(() => console.log("Successfully pinned directory", getCids().potr))
        .catch((e) => console.error(e.message));
})();
