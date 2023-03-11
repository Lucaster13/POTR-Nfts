import axios from "axios";
import { ALGO_INDEXER_SERVER } from "./constants";
import { createReachApi, deleteAsa, getAdminAcc } from "./utils";

/*
    DELETE ALL ASSETS

    NOTE: Only use this as the potr admin, it will delete all of the assets within your account that you have created
*/
(async () => {
    const reach = createReachApi();
    const admin = await getAdminAcc();

    const assetUrl = `${ALGO_INDEXER_SERVER}/v2/accounts/${reach.formatAddress(admin)}/assets`;

    while (true) {
        console.log("Loading assets...");

        const { data } = await axios.get(assetUrl);

        if (!data.assets.length) {
            console.log("No more assets to destroy");
            break;
        } else {
            console.log(data.assets.length, "assets found");
        }

        // attempt to delete assets
        let assetsDeleted = 0;

        await Promise.all(
            data.assets.map(({ "asset-id": id }) =>
                deleteAsa(admin, id)
                    .then(() => assetsDeleted++)
                    .catch((e) => console.error(`Encountered Error: ${e.message}, Skipping...`))
            )
        );

        console.log(`\n\nDestroyed ${assetsDeleted} assets successfully\n\n`);
    }
})();
