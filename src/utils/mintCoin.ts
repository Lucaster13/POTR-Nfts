import { ReachAccount } from "@jackcom/reachduck";
import { CIDString } from "nft.storage";
import { Arc69Metadata, AsaId, CoinType } from "../types";
import { POTR_URL } from "./constants";
import mintAsa, { MintAsaParams } from "./mintAsa.js";

// params for coin asa's
const coinInfo: Record<CoinType, [string, string, number]> = {
    bronze: ["Bronze Coin", "POTRBC", 1000],
    silver: ["Silver Coin", "POTRSC", 500],
    gold: ["Gold Coin", "POTRGC", 100],
};

export default async (adminAcc: ReachAccount, coinType: CoinType, cid: CIDString) => {
    try {
        // get coin info based on type
        const [name, sym, supply] = coinInfo[coinType];

        // create metadata
        const metadata: Arc69Metadata = {
            standard: "arc69",
            description: `Protectors of the Rand - ${name}`,
            external_url: POTR_URL,
            mime_type: "image/png",
            properties: {},
        };

        // encode the metadata for asset note
        const encodedNote = new TextEncoder().encode(JSON.stringify(metadata));

        // create params to mint asset
        const mintParams: MintAsaParams = {
            acc: adminAcc,
            supply,
            sym,
            name,
            url: `ipfs://${cid}`,
            note: encodedNote,
        };

        // mint coin
        const asaId: AsaId = await mintAsa(mintParams);
        console.log(`Mint Success - ${name}`);

        // return asa id and cid
        return { asaId, cid };
    } catch (e) {
        throw new Error(e.message);
    }
};
