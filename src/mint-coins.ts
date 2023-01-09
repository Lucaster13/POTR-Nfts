import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { COIN_TYPES, getAsaIds, getCids, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, setAsaIds } from "./utils";
import mintCoin from "./utils/mintCoin";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

(async () => {
    // get reach handle
    const reach = createReachAPI();
    // sign into admin account
    const admin: ReachAccount = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);

    if (!getCids().coin.length) {
        console.log("No cids for coins to mint with");
        return;
    }

    // for each coin cid, mint the coin
    await Promise.all(COIN_TYPES.map((coinType) => mintCoin(admin, coinType)))
        .then((asaIds) => setAsaIds({ coin: asaIds }))
        .then(() => console.log("Success minting coins", getAsaIds().coin));
})();
