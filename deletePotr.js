import deleteAsa from "./deleteAsa.js";
import { unpinNFT } from "./ipfs.js";

export default async function deletePotr(adminAcc, { asaId, cid }) {
    try {
        console.log("cleaning up potr");
        // delete pin and throw error
        console.log("unpinning nft");
        await unpinNFT(cid);
        // delete asset if it was created
        console.log("deleting asset");
        if (asaId) await deleteAsa(adminAcc, asaId);
        console.log(`asset ${asaId} deleted successfully`);
    } catch (e) {
        throw new Error(e);
    }
}
