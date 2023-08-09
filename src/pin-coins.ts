import { getNftStorage } from "./utils";
import { coinFilesObj } from "./utils/files";

// pins every asset inside /coins folder to ipfs
(async () => {
	const nftStorage = getNftStorage();
	return nftStorage
		.rateLimiter()
		.then(() => console.log(`pinning file(s) from /coins`))
		.then(() => nftStorage.storeDirectory(coinFilesObj))
		.then((cid) => console.log("Successfully pinned directory", cid))
		.catch((e) => console.error(e.message));
})();
