import { createReachAPI, ReachAccount } from "@jackcom/reachduck";
import { AsaId } from "../types";
import { makeRateLimiter } from "./common";
import { ALGOSDK_PARAMS } from "./constants";

export interface MintAsaParams {
    acc: ReachAccount;
    supply: number;
    sym: string;
    name: string;
    url: string;
    metadataHash?: string;
    note: Uint8Array;
}

// rate limit
export default makeRateLimiter(60, 60).wrap(
    async ({
        acc,
        supply,
        sym,
        name,
        url,
        metadataHash = undefined,
        note = undefined, // this is the arc69 traits data encoded
    }: MintAsaParams): Promise<AsaId> => {
        try {
            console.log(`Minting ${name}...`);
            const reach = createReachAPI();

            const { algosdk } = reach;
            const algodClient = new algosdk.Algodv2(...ALGOSDK_PARAMS);

            // get initial txn params
            const params = await algodClient.getTransactionParams().do();

            // Asset creation specific parameters (immutable)
            const { addr, sk } = acc.networkAccount;
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
            const reserve = addr;
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
                params
            );

            const rawSignedTxn = txn.signTxn(sk);

            const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();

            // wait for transaction to be confirmed
            const ptx = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

            // Get the new asset's information from the creator account
            const assetID = ptx["asset-index"];

            return assetID;
        } catch (e) {
            throw new Error(e);
        }
    }
);
