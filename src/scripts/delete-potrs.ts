import { ASA_IDS } from "../../data";
import { getAdminAcc, getAlgoNetwork } from "../lib/algo";
import deleteAsa from "./delete-asa";
import { safeCall } from "../lib/utils";

/*
    DESTROY ALL POTRS

    reads asa ids json and tries to destroy all potrs that exist
*/
(async () => {
	// get admin account
	const admin = await getAdminAcc();

	// read potr asa ids
	const potrAsaIds = ASA_IDS[getAlgoNetwork()].potr;

	// if no ids, return
	if (!potrAsaIds.length) throw new Error("No Potrs to destroy");

	let potrsDeleted = 0;

	const deletePotr = (asaId: number) => safeCall(() => deleteAsa(admin, asaId).then(() => potrsDeleted++));

	// attempt to delete assets
	await Promise.all(potrAsaIds.map(deletePotr));

	console.log("finished deleting assets total:", potrsDeleted);
})();
