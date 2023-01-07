import { ReachAccount } from "@jackcom/reachduck";
import { CIDString } from "nft.storage";
import { AsaId, PotrTraits } from "../types";
import mintAsa, { MintParams } from "./mintAsa.js";

export default async (adminAcc: ReachAccount, id: number, cid: CIDString, traits: PotrTraits) => {
    try {
        // create traits metadata object
        const idString = String(id).padStart(4, "0");
        const metadata = {
            standard: "arc69",
            description: `Protector of the Rand #${idString}`,
            external_url: "protectorsoftherand.com",
            mime_type: "image/png",
            properties: traits,
        };

        // encode the metadata for asset note
        const encodedNote = new TextEncoder().encode(JSON.stringify(metadata));

        // create params to mint asset
        const mintParams: MintParams = {
            acc: adminAcc,
            supply: 1,
            sym: `POTR${idString}`,
            name: `Protector ${idString}`,
            url: `ipfs://${cid}`,
            note: encodedNote,
        };

        // mint potr
        const asaId: AsaId = await mintAsa(mintParams);
        console.log(`Mint Success - POTR${idString}`);

        // return asa id and cid
        return { asaId, cid };
    } catch (e) {
        throw new Error(e.message);
    }
};
