import { Algo, getAdminAddr, getAlgoNetwork, getPotrMetadataFromAsaId } from "potr-common";
import { safeCall, writeToJson } from "../lib/utils";

(async () => {
	const adminAddr = getAdminAddr();
	const asaIds = await Algo.getPotrAsaIdsInWallet(adminAddr).then((ids) => ids.slice(0, 100));
	console.log("found potr asa Id", asaIds.length);

	const getPotrMetadata = (asaId: number) =>
		safeCall(() => {
			console.log("getting potr metadata for", asaId);
			return getPotrMetadataFromAsaId(asaId);
		});

	const allMds = await Promise.all(asaIds.map(getPotrMetadata));

	writeToJson(allMds, `potr-full-metadata-${getAlgoNetwork()}`.toLowerCase());
})();
