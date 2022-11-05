import { createConnectorAPI, createReachAPI, loadReachWithOpts } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { deleteAsa, makeRateLimiter, RAND_KINGDOM_MNEMONIC, REACH_NETWORK, REACH_PROVIDER_ENV } from "./utils";

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
    // rate limit 60 rps because nft storage will throttle and this will break
    const rateLimitedDeleteAsa = makeRateLimiter(60, 60).wrap(deleteAsa);
    // loop until there are no assets retrieved from the request
    let assetsDeleted = 0;
    while (true) {
        // attempt to load 2000 assets
        const { assets } = await connector.loadAssets(admin.networkAccount.addr, 2000);

        if (!assets.length) break;

        // attempt to delete assets
        const deleteResponses = await Promise.all(
            assets
                .filter((a: any) => a !== null)
                .map(async ({ id }) => {
                    try {
                        await rateLimitedDeleteAsa(admin, id);
                        return true;
                    } catch (e) {
                        console.error(`failed to delete  ${id} ${e.message}`);
                    }
                })
        );

        // add to successfully deleted asset count
        deleteResponses.filter((res) => res).forEach(() => assetsDeleted++);
    }

    console.log(`Deleted ${assetsDeleted} assets successfully`);
})();
