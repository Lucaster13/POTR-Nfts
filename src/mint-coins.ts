import { CIDS, COIN_TYPES, REACH_NETWORK } from "potr-common";
import { getAdminAcc, writeToJson } from "./utils";
import mintCoin from "./utils/mint-coin";
import safeCall from "./utils/safe-call";

(async () => {
	const admin = await getAdminAcc();

	if (!CIDS.coin.length) {
		console.log("No cids for coins to mint with");
		return;
	}

	// for each coin cid, mint the coin
	const coins = await Promise.all(COIN_TYPES.map((coin) => safeCall(() => mintCoin(admin, coin)))).then((asaIds) =>
		console.log("Success minting coins", asaIds),
	);

	writeToJson(coins, `potr-ids-${REACH_NETWORK}`);
})();
