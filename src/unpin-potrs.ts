import { getCids, getNftStorage, setCid } from "./utils";

/*
 Unpin Potrs
*/
(async () => {
    const nftStorage = getNftStorage();
    const potrCid = getCids().potr;
    nftStorage
        .rateLimiter()
        .then(() => console.log("attempting to unpin", potrCid))
        .then(() => nftStorage.delete(potrCid))
        .then(() => setCid({ potr: "" }))
        .then(() => console.log("potrs successfully unpinned!"))
        .catch((e) => console.error(e.message));
})();
