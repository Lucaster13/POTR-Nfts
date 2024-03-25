import { Algo, Potr } from "potr-common";
import { safeCall, writeToJson } from "../lib/utils";

(async () => {
	const adminAddr = Algo.getAdminAddr();
	const { asaIds } = await Algo.getAllAssetIdsInWallet(adminAddr);
	console.log("found potr asa ids:", asaIds.length);

	const getPotrMetadata = (asaId: number) =>
		safeCall(() => {
			console.log("getting potr metadata for", asaId);
			return Potr.getMetadata(asaId);
		});

	const allMds = await Promise.all(asaIds.map(getPotrMetadata));

	writeToJson(allMds, `potr-full-metadata-${Algo.getAlgoNetwork()}`.toLowerCase());
})();
