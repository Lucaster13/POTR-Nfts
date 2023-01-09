import { loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { getCids, getNftStorage, REACH_NETWORK, REACH_PROVIDER_ENV, setCid } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

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
