import { algod, algorandConfig, getReserveAddrFromCID, makeRateLimiter } from "potr-common";
import algosdk, { Account } from "algosdk";

export interface MintAsaParams {
	acc: Account;
	supply: number;
	sym: string;
	name: string;
	url: string;
	metadataHash?: string;
	note?: Uint8Array;
	cid?: string;
}

// rate limit
export default makeRateLimiter(...algorandConfig.tps).wrap(
	async ({
		acc,
		supply,
		sym,
		name,
		url,
		metadataHash,
		note, // this is the arc69 traits data encoded
		cid,
	}: MintAsaParams): Promise<number> => {
		try {
			console.log(`Minting ${name}...`);
			if (cid) {
				console.log("minting NFT with cid", cid);
			}

			// get initial txn params
			const params = await algod.getTransactionParams().do();

			// Asset creation specific parameters (immutable)
			const { addr, sk } = acc;
			// Whether user accounts will need to be unfrozen before transacting
			const defaultFrozen = false;
			// integer number of decimals for asset unit calculation
			const decimals = 0;
			// total number of this asset available for circulation
			const totalIssuance = supply;
			// Optional string pointing to a URL relating to the asset
			const assetURL = url;
			// Optional hash commitment of some sort relating to the asset. 32 character length.
			const assetMetadataHash = metadataHash;

			// The following parameters are the only ones (mutable)
			// Specified address can change reserve, freeze, clawback, and manager
			const manager = addr;
			// Specified address is considered the asset reserve
			// (it has no special privileges, this is only informational)
			const reserve = cid ? getReserveAddrFromCID(cid) : addr;
			// Specified address can freeze or unfreeze user asset holdings
			const freeze = addr;
			// Specified address can revoke user asset holdings and send them to other addresses
			const clawback = addr;

			const unitName = sym;
			const assetName = name;

			// signing and sending "txn" allows "addr" to create an asset
			const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
				addr,
				note,
				totalIssuance,
				decimals,
				defaultFrozen,
				manager,
				reserve,
				freeze,
				clawback,
				unitName, // Used to display asset units to user (EX: POTRBC)
				assetName, // Friendly name of the asset
				assetURL,
				assetMetadataHash,
				params,
			);

			const rawSignedTxn = txn.signTxn(sk);

			const tx = await algod.sendRawTransaction(rawSignedTxn).do();

			// wait for transaction to be confirmed
			const ptx = await algosdk.waitForConfirmation(algod, tx.txId, 4);

			// Get the new asset's information from the creator account
			const assetID = ptx["asset-index"];

			return assetID;
		} catch (e) {
			throw new Error(e);
		}
	},
);
