import { ReachAccount } from "@jackcom/reachduck";
import { Arc69Metadata, AsaId, CoinType } from "potr-utils/types";
import { POTR_URL } from "./constants";
import { getCoinIpfsUrl } from "./ipfs";
import mintAsa, { MintAsaParams } from "./mint-asa.js";

// params for coin asa's
const coinInfo: Record<CoinType, [string, string, number]> = {
    bronze: ["Bronze Coin", "POTRBC", 1000],
    silver: ["Silver Coin", "POTRSC", 500],
    gold: ["Gold Coin", "POTRGC", 100],
};

export default async (adminAcc: ReachAccount, coinType: CoinType): Promise<AsaId> => {
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
            url: getCoinIpfsUrl(coinType),
            note: encodedNote,
        };

        // mint coin
        const asaId: AsaId = await mintAsa(mintParams);
        console.log(`Mint Success - ${name}`);

        return asaId;
    } catch (e) {
        throw new Error(e.message);
    }
};
