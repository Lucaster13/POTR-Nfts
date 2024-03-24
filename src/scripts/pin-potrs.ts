import { pin } from "../lib/nftstorage";
import { getPotrFiles, writeToJson } from "../lib/utils";

// pins every asset inside /nfts folder to ipfs
(async () => {
	const files = await getPotrFiles().then((f) => [f[0]]);

	console.log(`pinning ${files.length} file(s) from /nfts`);

	const cids = await Promise.all(files.map(pinPotr));

	console.log(`finished pinning ${cids.length}`);

	writeToJson(cids, "potr-cids");
})();

async function pinPotr(image: File) {
	const cid = await pin(image);
	console.log("Successfully pinned:", cid);
	return cid;
}
