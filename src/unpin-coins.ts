import { getCids, getNftStorage, setCid } from "./utils";

/*
 Unpin coins
*/
(async () => {
    const nftStorage = getNftStorage();
    const coinCid = getCids().coin;
    nftStorage
        .rateLimiter()
        .then(() => console.log("attempting to unpin", coinCid))
        .then(() => nftStorage.delete(coinCid))
        .then(() => setCid({ coin: "" }))
        .then(() => console.log("coins successfully unpinned!"))
        .catch((e) => console.error(e.message));
})();
