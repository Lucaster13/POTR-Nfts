import { unpin } from "../lib/nftstorage";
import { readFromJson, writeToJson } from "../lib/utils";

/*
 Unpin Potrs
*/
(async () => {
	const potrCids = readFromJson("potr-cids") as string[];

	console.log(`unpinning ${potrCids.length} file(s) from nft.storage, do not stop the program`);

	const unpinNft = async (cid: string) => unpin(cid).then(() => console.log("successfully unpinned", cid));

	await Promise.all(potrCids.map(unpinNft));

	console.log(`finished pinning ${potrCids.length}`);

	writeToJson([], "potr-cids");
})();
