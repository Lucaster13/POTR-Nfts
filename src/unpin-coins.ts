import { loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { Cids } from "./types";

import { isCidArray, isError, REACH_NETWORK, REACH_PROVIDER_ENV, readFromJson, unpinNFT, writeToJson } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

/*
    UNPIN ALL POTRS

    reads cids json and tries to unpin all nfts
*/
(async () => {
    // read coin cids
    const { potr: potrCids, coin } = readFromJson<Cids>("cids");
    const coinCids = coin.map(({ cid }) => cid);

    // if no cids, stop
    if (!isCidArray(coinCids) || !coinCids.length) return;

    // attempt to unpin potrs
    await Promise.all(
        coinCids.map(async (cid) => {
            try {
                await unpinNFT(cid);
                return cid;
            } catch (e) {
                if (isError(e)) console.error(`failed to delete ${cid} ${e.message}`);
            }
        })
    );

    // remove coins and update cids json
    writeToJson({ potr: potrCids, coin: [] }, "cids");

    console.log(`Unpinned Coins successfully`);
})();
