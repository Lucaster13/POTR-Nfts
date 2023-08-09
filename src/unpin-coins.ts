import { CIDS } from "potr-common";
import { getNftStorage } from "./utils";

/*
 Unpin coins
*/
(async () => {
	const nftStorage = getNftStorage();
	const coinCid = CIDS.coin;
	nftStorage
		.rateLimiter()
		.then(() => console.log("attempting to unpin", coinCid))
		.then(() => nftStorage.delete(coinCid))
		.then(() => console.log("coins successfully unpinned!"))
		.catch((e) => console.error(e.message));
})();
