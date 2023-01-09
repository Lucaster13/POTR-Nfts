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
