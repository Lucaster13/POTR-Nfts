import { createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { deleteAsa, getAsaIds, isAsaIdArray, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, setAsaIds } from "./utils";

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

    // read potr asa ids
    const potrAsaIds = getAsaIds().potr;

    // if no ids, return
    if (!isAsaIdArray(potrAsaIds) || !potrAsaIds.length) throw new Error("No Potrs to destroy");

    let potrsDeleted = 0;

    // attempt to delete assets
    await Promise.all(
        potrAsaIds.map((asaId) =>
            deleteAsa(admin, asaId)
                .then(() => setAsaIds({ potr: getAsaIds().potr.filter((id) => id !== asaId) }))
                .then(() => potrsDeleted++)
                .catch((e) => console.error(e.message))
        )
    );

    console.log("finished deleting assets total:", potrsDeleted);
})();
