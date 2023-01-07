import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { CIDS, POTR_TRAITS } from "./data";
import { AsaId, AsaIds, PotrTraits } from "./types";

import { mintPotr, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, readFromJson, writeToJson } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

const POTR_CIDS = CIDS.potr;

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
    // loop 6000 times
    const potrAsaIds: AsaId[] = [];
    let retryIdxs: number[] = [];

    // get acc
    const reach = createReachAPI();
    const admin: ReachAccount = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);

    // first loop of minting potrs
    await Promise.all(
        POTR_CIDS.map(async ({ cid, idx }) => {
            try {
                // get traits from POTR_TRAIS object with the index that matches this cid
                const traits = POTR_TRAITS[idx] as PotrTraits;
                // create potr (its id is always 1 + its index )
                const { asaId } = await mintPotr(admin, idx + 1, cid, traits);
                // add to potrAsaIds
                potrAsaIds.push(asaId);
            } catch (e) {
                retryIdxs.push(idx);
            }
        })
    );

    console.log(`${potrAsaIds.length} nfts successfully minted on first pass`);
    console.log(`${retryIdxs.length} nfts failed to mint on first pass`);

    while (retryIdxs.length) {
        await Promise.all(
            retryIdxs.map(async (idx) => {
                try {
                    const { cid } = CIDS[idx];
                    // get traits from POTR_TRAIS object with the index that matches this cid
                    const traits = POTR_TRAITS[idx] as PotrTraits;
                    // create potr
                    const { asaId } = await mintPotr(admin, idx + 1, cid, traits);
                    // add to potrAsaIds
                    potrAsaIds.push(asaId);
                    // remove from retries
                    retryIdxs = retryIdxs.filter((retryIdx) => retryIdx !== idx);
                } catch (e) {
                    // do nothing because we will loop again and retry automatically
                }
            })
        );
        console.log(`${potrAsaIds.length} nfts successfully minted on retry`);
        console.log(`${retryIdxs.length} nfts failed to mint on retry`);
    }

    console.log(`${potrAsaIds.length} potrs made`);

    // update asa id json
    const { coin: coinAsaIds } = readFromJson<AsaIds>("asaIds");
    writeToJson({ potr: potrAsaIds, coin: coinAsaIds }, "asaIds");

    // print asa ids to the console
    console.log("potr asa ids successfully written to json");
})();
