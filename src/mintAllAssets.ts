import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { CIDS, POTR_TRAITS } from "./output";
import { AsaId, PotrTraits } from "./types";

import { makeRateLimiter, mintPotr, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, writeToJson } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
    // loop 6000 times
    const asaIds: AsaId[] = [];
    let retryIdxs: number[] = [];

    // get acc
    const reach = createReachAPI();
    const admin: ReachAccount = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const limiter = makeRateLimiter(60, 60);
    const rateLimitedMintPotr = limiter.wrap(mintPotr);
    await Promise.all(
        CIDS.map(async ({ cid, idx }) => {
            try {
                // get traits from POTR_TRAIS object with the index that matches this cid
                const traits = POTR_TRAITS[idx] as PotrTraits;
                // create potr (its id is always 1 + its index )
                const { asaId } = await rateLimitedMintPotr(admin, idx + 1, cid, traits);
                // add to asaids
                asaIds.push(asaId);
            } catch (e) {
                retryIdxs.push(idx);
            }
        })
    );

    console.log(`${asaIds.length} nfts successfully minted on first pass`);
    console.log(`${retryIdxs.length} nfts failed to mint on first pass`);

    while (retryIdxs.length) {
        await Promise.all(
            retryIdxs.map(async (idx) => {
                try {
                    const { cid } = CIDS[idx];
                    // get traits from POTR_TRAIS object with the index that matches this cid
                    const traits = POTR_TRAITS[idx] as PotrTraits;
                    // create potr
                    const { asaId } = await rateLimitedMintPotr(admin, idx + 1, cid, traits);
                    // add to asaids
                    asaIds.push(asaId);
                    // remove from retries
                    retryIdxs = retryIdxs.filter((retryIdx) => retryIdx !== idx);
                } catch (e) {
                    // do nothing because we will loop again and retry automatically
                }
            })
        );
        console.log(`${asaIds.length} nfts successfully minted on retry`);
        console.log(`${retryIdxs.length} nfts failed to mint on retry`);
    }

    console.log(`${asaIds.length} potrs made`);

    // save asa ids
    writeToJson("potrAsaIds", asaIds);
})();
