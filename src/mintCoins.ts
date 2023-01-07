import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { mintAsa, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, writeToJson } from "./utils";

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
    // create params for coin asa's
    const coinInfo: Array<[string,string,number]> = [
        ["Bronze Coin", "POTRBC", 1000],
        ["Silver Coin", "POTRSC", 500],
        ["Gold Coin", "POTRGC", 100],
    ];
    const url = "protectorsoftherand.com";

    // for each param set, mint an asa
    const asaIds = await Promise.all(
        coinInfo.map(([name, sym, supply]) =>
            mintAsa({
                acc: admin,
                supply,
                sym,
                name,
                url,
            })
        )
    );

    // print asa ids to the console
    console.log("Success");
    console.log(asaIds);
    writeToJson("coinAsaIds", asaIds);
})();
