import { PotrTraits, Algo } from "potr-common";
import { POTR_CIDS, POTR_TRAITS } from "../../data";
import { safeCall, writeToJson } from "../lib/utils";
import mint from "./mint-potr";

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
	const admin = await Algo.getAdminAcc();

	const potrMetadata = POTR_TRAITS as unknown[] as PotrTraits[];
	const potrCids = POTR_CIDS;

	console.log("minting", potrCids.length, "potrs");

	const mintPotr = (cid: string, idx: number) => safeCall(() => mint(admin, idx + 1, potrMetadata[idx], cid));

	const potrAsaIds = await Promise.all(potrCids.map(mintPotr));

	writeToJson(potrAsaIds, `potr-asa-ids-${Algo.getAlgoNetwork()}`.toLowerCase());
	console.log("potr asa ids successfully written to json:", potrAsaIds.length);
})();
