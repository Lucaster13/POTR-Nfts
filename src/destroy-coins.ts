import { ASA_IDS, REACH_NETWORK } from "potr-common";
import { deleteAsa, getAdminAcc, isAsaIdArray } from "./utils";
import safeCall from "./utils/safe-call";

/*
    DESTROY ALL COINS
*/
(async () => {
	// get admin account
	const admin = await getAdminAcc();
	const coinAsaIds = ASA_IDS[REACH_NETWORK].coin;

	// if no ids, stop
	if (!isAsaIdArray(coinAsaIds) || !coinAsaIds.length) return;

	// attempt to delete assets
	await Promise.all(
		coinAsaIds.map((id) =>
			safeCall(() =>
				deleteAsa(admin, id)
					.catch((e) => console.error(`failed to delete ${id} ${e.message}`))
					.finally(() => id),
			),
		),
	);

	console.log(`Deleted Coins successfully`);
})();
