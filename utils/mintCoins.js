import { createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { RAND_KINGDOM_MNEMONIC } from "../.secrets";
import mintAsa from "./mintAsa.js";
import { REACH_NETWORK, REACH_PROVIDER_ENV } from "./_constants.js";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

(async () => {
    // get reach handle
    const reach = createReachAPI();
    // sign into rank account
    const RandKingdomVault = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    // create params for coin asa's
    const coinInfo = [
        [
            "Bronze Coin",
            "POTRBC", 1000,
        ],
        [
            "Silver Coin", "POTRSC", 500,
        ],
        [
            "Gold Coin", "POTRGC", 100,
        ],
    ];
    const url = "protectorsoftherand.com";

    // for each param set, mint an asa
    const asaIds = await Promise.all(coinInfo
        .map(([
            name, sym, supply,
        ]) => mintAsa({
            acc: RandKingdomVault,
            supply,
            sym,
            name,
            url,
        })));

    // print asa ids to the console
    console.log("Success");
    console.log(asaIds);
})();
