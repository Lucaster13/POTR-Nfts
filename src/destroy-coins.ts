import { createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { AsaIds } from "./types";

import { deleteAsa, isAsaIdArray, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, readFromJson, writeToJson } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

/*
    DESTROY ALL COINS
*/
(async () => {
    // get admin account
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const { potr: potrAsaIds, coin: coinAsaIds } = readFromJson<AsaIds>("asaIds");

    // if no ids, stop
    if (!isAsaIdArray(coinAsaIds) || !coinAsaIds.length) return;

    // attempt to delete assets
    await Promise.all(
        coinAsaIds.map(async (id) => {
            try {
                await deleteAsa(admin, id);
                return id;
            } catch (e) {
                console.error(`failed to delete ${id} ${e.message}`);
            }
        })
    );

    // remove coins and update asaIds json
    writeToJson({ potr: potrAsaIds, coin: [] }, "asaIds");

    console.log(`Deleted Coins successfully`);
})();
