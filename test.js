import { unpinNFT } from "./utils/ipfs.js";
import { sleep } from "./_common.js";

async function upinAssets() {
    for (const cid of []) {
        await unpinNFT(cid);
        await sleep(300);
    }
}

(async () => {

})();
