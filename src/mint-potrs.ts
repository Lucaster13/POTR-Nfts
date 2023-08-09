import { REACH_NETWORK, TraitsT } from "potr-common";
import { POTR_TRAITS } from "./data";
import { getAdminAcc, mintPotr, writeToJson } from "./utils";
import { getPotrFilesArr } from "./utils/files";
import safeCall from "./utils/safe-call";

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
	const admin = await getAdminAcc();

	const potrMetadata = POTR_TRAITS as unknown as TraitsT[];
	const potrFiles = await getPotrFilesArr();
	const potrAsaIds = [];

	console.log("minting", potrFiles.length, "potrs");

	await Promise.all(
		potrFiles.map(({ name }, idx) =>
			safeCall(() => mintPotr(admin, idx + 1, potrMetadata[idx])) // only add asaId if it does not exist
				.then((asaId) => potrAsaIds.push(asaId))
				.then(() => {
					console.log("Successfully updated potr asa ids, num ids:", potrAsaIds.length);
				})
				.catch(() => console.error(name)),
		),
	);

	writeToJson(potrAsaIds, `potr-ids-${REACH_NETWORK}`);
	console.log("potr asa ids successfully written to json:", potrAsaIds.length);
})();
