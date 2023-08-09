import { getNftStorage } from "./utils";
import { potrFilesObj } from "./utils/files";

// pins every asset inside /nfts folder to ipfs
(async () => {
	const nftStorage = getNftStorage();
	return nftStorage
		.rateLimiter()
		.then(() => console.log(`pinning file(s) from /nfts`))
		.then(() => nftStorage.storeDirectory(potrFilesObj))
		.then((cid) => console.log("Successfully pinned directory", cid))
		.catch((e) => console.error(e.message));
})();
