import { ASA_IDS, REACH_NETWORK } from "potr-common";
import { deleteAsa, getAdminAcc, isAsaIdArray } from "./utils";
import safeCall from "./utils/safe-call";

/*
    DESTROY ALL POTRS

    reads asa ids json and tries to destroy all potrs that exist
*/
(async () => {
	// get admin account
	const admin = await getAdminAcc();

	// read potr asa ids
	const potrAsaIds = ASA_IDS[REACH_NETWORK].potr;

	// if no ids, return
	if (!isAsaIdArray(potrAsaIds) || !potrAsaIds.length) throw new Error("No Potrs to destroy");

	let potrsDeleted = 0;

	// attempt to delete assets
	await Promise.all(
		potrAsaIds.map((asaId) =>
			safeCall(() =>
				deleteAsa(admin, asaId)
					.then(() => potrsDeleted++)
					.catch((e) => console.error(e.message)),
			),
		),
	);

	console.log("finished deleting assets total:", potrsDeleted);
})();
