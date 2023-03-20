import { makeRateLimiter } from "./common";
import { ALGOSDK_PARAMS } from "../constants";
import { createReachApi } from "./stdlib";
import { AsaId, ReachAccount } from "../types";

// wrap with rate limit
export default makeRateLimiter(60, 60).wrap(async (acc: ReachAccount, asaId: AsaId) => {
    try {
        // Destroy an Asset:
        // All of the created assets should now be back in the creators
        // Account so we can delete the asset.
        // If this is not the case the asset deletion will fail

        // First update changing transaction parameters
        // We will account for changing transaction parameters
        // before every transaction in this example
        console.log(`Deleting ${asaId}...`);
        const reach = createReachApi();

        const { algosdk } = reach as any;
        const algodClient = new algosdk.Algodv2(...ALGOSDK_PARAMS);

        const params = await algodClient.getTransactionParams().do();

        // The address for the from field must be the manager account
        // Which is currently the creator addr
        const { addr, sk } = acc.networkAccount;
        const note = undefined;

        // if all assets are held by the asset creator,
        // the asset creator can sign and issue "txn" to remove the asset from the ledger.
        const dtxn = algosdk.makeAssetDestroyTxnWithSuggestedParams(addr, note, asaId, params);
        const rawSignedTxn = dtxn.signTxn(sk);
        const dtx = await algodClient.sendRawTransaction(rawSignedTxn).do();

        // Wait for confirmation
        await algosdk.waitForConfirmation(algodClient, dtx.txId, 4);

        // Get the completed Transaction
        console.log(`Successfully deleted ${asaId}`);
    } catch (e) {
        throw new Error(e);
    }
});
