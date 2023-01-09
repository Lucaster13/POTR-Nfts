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
    DESTROY ALL COINS
*/
(async () => {
    // get admin account
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const coinAsaIds = getAsaIds().coin;

    // if no ids, stop
    if (!isAsaIdArray(coinAsaIds) || !coinAsaIds.length) return;

    // attempt to delete assets
    await Promise.all(
        coinAsaIds.map((id) =>
            deleteAsa(admin, id)
                .catch((e) => console.error(`failed to delete ${id} ${e.message}`))
                .finally(() => id)
        )
    );

    // remove coins and update asaIds json
    setAsaIds({ coin: [] });

    console.log(`Deleted Coins successfully`);
})();
