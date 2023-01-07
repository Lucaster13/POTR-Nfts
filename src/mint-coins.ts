import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { CIDS } from "./data";
import { AsaIds } from "./types";
import { RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, readFromJson, writeToJson } from "./utils";
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

    // for each coin cid, mint the coin
    const coinAsaIds = await Promise.all(CIDS.coin.map(({ cid, idx }) => mintCoin(admin, idx, cid)));

    // print asa ids to the console
    console.log("Success minting coins");

    // update asa id json
    const { potr: potrAsaIds } = readFromJson<AsaIds>("asaIds");
    writeToJson({ potr: potrAsaIds, coin: coinAsaIds }, "coinAsaIds");

    // print asa ids to the console
    console.log("coin asa ids successfully written to json");
})();
