import { ReachAccount } from "@jackcom/reachduck";
import { Arc69Metadata, AsaId, PotrTraits } from "potr-utils/types";
import { POTR_URL } from "./constants";
import { getPotrIpfsUrl } from "./ipfs";
import mintAsa, { MintAsaParams } from "./mint-asa.js";

export default async (adminAcc: ReachAccount, id: number, traits: PotrTraits, potrFileName: string) => {
    try {
        // create traits metadata object
        const idString = String(id).padStart(4, "0");
        const metadata: Arc69Metadata = {
            standard: "arc69",
            description: `Protector of the Rand #${idString}`,
            external_url: POTR_URL,
            mime_type: "image/png",
            properties: traits,
        };

        // encode the metadata for asset note
        const encodedNote = new TextEncoder().encode(JSON.stringify(metadata));

        // create params to mint asset
        const mintParams: MintAsaParams = {
            acc: adminAcc,
            supply: 1,
            sym: `POTR${idString}`,
            name: `Protector ${idString}`,
            url: getPotrIpfsUrl(potrFileName),
            note: encodedNote,
        };

        // mint potr
        const asaId: AsaId = await mintAsa(mintParams);
        console.log(`Mint Success - POTR${idString}`);

        // return asa id and cid
        return asaId;
    } catch (e) {
        throw new Error(e.message);
    }
};
