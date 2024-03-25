import { Algo } from "potr-common";
import { safeCall } from "../lib/utils";
import deleteAsa from "./delete-asa";

/*
    DELETE ALL ASSETS

    NOTE: Only use this as the potr admin, it will delete all of the assets within your account that you have created
*/
(async () => {
	const admin = await Algo.getAdminAcc();

	while (true) {
		console.log("Loading assets...");

		const potrIds = await Algo.indexer
			.lookupAccountAssets(admin.addr)
			.do()
			.then((r) => r.assets.map((a) => a["asset-id"]));

		if (!potrIds.length) {
			console.log("No more assets to destroy");
			break;
		} else {
			console.log(potrIds.length, "assets found");
		}

		// attempt to delete assets
		let assetsDeleted = 0;

		await Promise.all(
			potrIds.map((id) =>
				safeCall(() =>
					deleteAsa(admin, id)
						.then(() => assetsDeleted++)
						.catch((e) => console.error(`Encountered Error: ${e.message}, Skipping...`)),
				),
			),
		);

		console.log(`\n\nDestroyed ${assetsDeleted} assets successfully\n\n`);
	}
})();
