import { createConnectorAPI, createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import fs from "fs";
import { RAND_KINGDOM_MNEMONIC } from "./.secrets.js";
import cids from "./cids.json" assert { type: "json" };
import potrTraits from "./metadata.json" assert { type: "json" };
import deleteAsa from "./utils/deleteAsa.js";
import mintPotr from "./utils/mintPotr.js";
import { makeRateLimiter } from "./_common.js";
import { REACH_NETWORK, REACH_PROVIDER_ENV } from "./_constants.js";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

// CREATE ALL ASSETS
(async () => {
    // return;
    // loop 6000 times
    const asaIds = [];
    let retryIdxs = [];
    // get acc
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const limiter = makeRateLimiter(60, 60);
    const rateLimitedMintPotr = limiter.wrap(mintPotr);
    await Promise.all(cids.map(async ({ cid, idx }) => {
        try {
            // create potr
            const { asaId } = await rateLimitedMintPotr(admin, idx + 1, cid, potrTraits[idx]);
            // add to asaids
            asaIds.push(asaId);
        } catch (e) {
            retryIdxs.push(idx);
        }
    }));

    console.log(`${asaIds.length} nfts successfully minted on first pass`);
    console.log(`${retryIdxs.length} nfts failed to mint on first pass`);

    while (retryIdxs.length) {
        await Promise.all(retryIdxs.map(async (idx) => {
            try {
                const { cid } = cids[idx];
                // create potr
                const { asaId } = await rateLimitedMintPotr(admin, idx + 1, cid, potrTraits[idx]);
                // add to asaids
                asaIds.push(asaId);
                // remove from retries
                retryIdxs = retryIdxs.filter((retryIdx) => retryIdx !== idx);
            } catch (e) {
                // do nothing
            }
        }));
        console.log(`${asaIds.length} nfts successfully minted on retry`);
        console.log(`${retryIdxs.length} nfts failed to mint on retry`);
    }

    console.log(`${asaIds.length} potrs made`);
    fs.writeFileSync("asaIds.json", JSON.stringify(asaIds, null, 2));
})();

// // DELETE ALL ASSETS
(async () => {
    return;
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const connector = createConnectorAPI();
    const limiter = makeRateLimiter(60, 60);
    const rateLimitedDeleteAsa = limiter.wrap(deleteAsa);
    let assets = [];
    do {
        assets = (await connector.loadAssets(admin.networkAccount.addr, 2000)).assets;
        await Promise.all(assets.filter((a) => a !== null).map(async ({ id }) => {
            try {
                await rateLimitedDeleteAsa(admin, id);
            } catch (e) {
                console.error(`failed to delete  ${id} ${e.message}`);
            }
        }));
    } while (assets.length);
})();
