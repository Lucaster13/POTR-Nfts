import { createConnectorAPI, createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { deleteAsa, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV } from "./utils";

// load reach
loadReachWithOpts(loadStdlib, {
    chain: "ALGO",
    network: REACH_NETWORK,
    providerEnv: REACH_PROVIDER_ENV,
});

/*
    DELETE ALL ASSETS

    NOTE: Only use this as the potr admin, it will delete all of the assets within your account that you have created
*/
(async () => {
    const reach = createReachAPI();
    const admin = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    const connector = createConnectorAPI();

    while (true) {
        console.log("Loading assets...");

        const { assets } = await connector.loadAssets(admin.networkAccount.addr, 200);

        const validAssets = assets.filter((a: any) => a !== null);

        if (!validAssets.length) {
            console.log("No Potrs to destroy");
            break;
        }

        // attempt to delete assets
        let assetsDeleted = 0;

        await Promise.all(
            validAssets.map(({ id }) =>
                deleteAsa(admin, id)
                    .then(() => assetsDeleted++)
                    .catch((e) => console.error(`Encountered Error: ${e.message}, Skipping...`))
            )
        );

        console.log(`\n\nDestroyed ${assetsDeleted} assets successfully\n\n`);
    }
})();
