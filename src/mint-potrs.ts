import { createReachAPI, loadReachWithOpts, ReachAccount } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";

import { getAsaIds, getMetadata, mintPotr, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV, setAsaIds } from "./utils";
import { getPotrFilesArr } from "./utils/files";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
    // get acc
    const reach = createReachAPI();
    const admin: ReachAccount = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);

    const potrMetadata = getMetadata();
    const potrFiles = await getPotrFilesArr();

    console.log("minting", potrFiles.length, "potrs");

    const retries = await Promise.all(
        potrFiles.map(({ name }, idx) =>
            mintPotr(admin, idx + 1, potrMetadata[idx], name) // only add asaId if it does not exist
                .then((asaId) => !getAsaIds().potr.includes(asaId) && setAsaIds({ potr: [...getAsaIds().potr, asaId] }))
                .then(() => {
                    console.log("Successfully updated potr asa ids, num ids:", getAsaIds().potr.length);
                    return null;
                })
                .catch((e) => {
                    console.error(e.message);
                    return { name, idx };
                })
        )
    );

    console.log("potr asa ids successfully written to json:", getAsaIds().potr.length);

    console.log(
        "failed to mint the following:",
        retries.filter((retry) => retry)
    );
})();
