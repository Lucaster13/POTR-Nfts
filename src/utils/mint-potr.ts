import { Arc69MetadataT, AsaIdT, POTR_URL, ReachAccountT, TraitsT } from "potr-common";
import { getPotrIpfsUrl } from "./ipfs";
import mintAsa, { MintAsaParams } from "./mint-asa.js";
import { getFileNameFromTraits } from "./traits";

export default async (adminAcc: ReachAccountT, id: number, traits: TraitsT) => {
	try {
		// create traits metadata object
		const idString = String(id).padStart(4, "0");
		const metadata: Arc69MetadataT = {
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
			url: getPotrIpfsUrl(getFileNameFromTraits(traits)),
			note: encodedNote,
		};

		// mint potr
		const asaId: AsaIdT = await mintAsa(mintParams);
		console.log(`Mint Success - POTR${idString}`);

		// return asa id and cid
		return asaId;
	} catch (e) {
		throw new Error(e.message);
	}
};
