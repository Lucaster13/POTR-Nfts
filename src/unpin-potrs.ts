import { CIDS } from "potr-common";
import { getNftStorage } from "./utils";

/*
 Unpin Potrs
*/
(async () => {
	const nftStorage = getNftStorage();
	const potrCid = CIDS.potr;
	nftStorage
		.rateLimiter()
		.then(() => console.log("attempting to unpin", potrCid))
		.then(() => nftStorage.delete(potrCid))
		.then(() => console.log("potrs successfully unpinned!"))
		.catch((e) => console.error(e.message));
})();
