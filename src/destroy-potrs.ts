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
    DESTROY ALL POTRS

    reads asa ids json and tries to destroy all potrs that exist
*/
(async () => {
    // get admin account
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);

    let potrsDeleted = 0;

    while (true) {
        // read potr asa ids
        const { potr: potrAsaIds, coin: coinAsaIds } = readFromJson<AsaIds>("asaIds");

        // if no ids, stop loop
        if (!isAsaIdArray(potrAsaIds) || !potrAsaIds.length) break;

        // attempt to delete assets
        const deletedIds = await Promise.all(
            potrAsaIds.map(async (id) => {
                try {
                    await deleteAsa(admin, id);
                    return id;
                } catch (e) {
                    console.error(`failed to delete ${id} ${e.message}`);
                }
            })
        );

        // add to successfully deleted asset count
        const successfullyDeletedIds = deletedIds.filter((id) => id);
        successfullyDeletedIds.forEach(() => potrsDeleted++);

        // remove potrs and update asaIds json
        const updatedPotrAsaIds = potrAsaIds.filter((id) => !successfullyDeletedIds.includes(id));
        writeToJson({ potr: updatedPotrAsaIds, coin: coinAsaIds }, "asaIds");
    }

    console.log(`Deleted ${potrsDeleted} potrs successfully`);
})();
