import { Account } from "algosdk";
import { Arc69Metadata, IPFS_TEMPLATE_URL, POTR_URL, PotrTraits } from "potr-common";
import mintAsa, { MintAsaParams } from "./mint-asa.js";

export default async (adminAcc: Account, id: number, traits: PotrTraits, cid: string) => {
	try {
		// create traits metadata object
		const idString = String(id).padStart(4, "0");
		const metadata: Arc69Metadata = {
			standard: "arc69",
			description: `Protectors of The Rand NFT - #${idString}`,
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
			url: IPFS_TEMPLATE_URL,
			note: encodedNote,
			cid,
		};

		// mint potr
		const asaId = await mintAsa(mintParams);
		console.log(`Mint Success - POTR${idString}`, asaId);

		// return asa id and cid
		return asaId;
	} catch (e) {
		throw new Error(e.message);
	}
};
