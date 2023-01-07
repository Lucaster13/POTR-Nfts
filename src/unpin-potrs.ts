import { loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { CIDS } from "./data";
import { Cids } from "./types";

import { REACH_NETWORK, REACH_PROVIDER_ENV, readFromJson, unpinNFT, writeToJson } from "./utils";

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
    let potrsUnpinned = 0;

    while (true) {
        // read potr cids
        const potrCids = readFromJson<Cids>("cids").potr.map(({ cid }) => cid);

        // if no cids, stop loop
        if (!potrCids.length) break;

        // attempt to unpin potrs
        const unpinnedCids = await Promise.all(
            potrCids.map(async (currCid) => {
                try {
                    await unpinNFT(currCid);
                } catch (e) {
                    console.log(e.message);
                    writeToJson({ ...CIDS, potr: readFromJson<Cids>("cids").potr.filter(({ cid }) => currCid !== cid) }, "cids");
                    return;
                }

                return currCid;
            })
        );

        // add to successfully unpinned count
        const successfullyUnpinnedCids = unpinnedCids.filter((cid) => cid);
        successfullyUnpinnedCids.forEach(() => potrsUnpinned++);
        writeToJson({ ...CIDS, potr: readFromJson<Cids>("cids").potr.filter(({ cid }) => !successfullyUnpinnedCids.includes(cid)) }, "cids");
    }

    console.log(`Unpinned ${potrsUnpinned} potrs successfully`);
})();
