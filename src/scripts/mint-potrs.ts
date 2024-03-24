import { PotrTraits } from "potr-common";
import { POTR_CIDS, POTR_TRAITS } from "../../data";
import { safeCall, writeToJson } from "../lib/utils";
import { getAdminAcc, getAlgoNetwork } from "../lib/algo";
import mint from "./mint-potr";

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
	const admin = await getAdminAcc();

	const potrMetadata = POTR_TRAITS as unknown[] as PotrTraits[];
	const potrCids = POTR_CIDS.slice(0, 1);

	console.log("minting", potrCids.length, "potrs");

	const mintPotr = (cid: string, idx: number) => safeCall(() => mint(admin, idx + 1, potrMetadata[idx], cid));

	const potrAsaIds = await Promise.all(potrCids.map(mintPotr));

	writeToJson(potrAsaIds, `potr-asa-ids-${getAlgoNetwork()}`);
	console.log("potr asa ids successfully written to json:", potrAsaIds.length);
})();
