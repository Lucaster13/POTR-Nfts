import {
	getAlgoClient,
	getAlgoIndexerClient,
	getAlgoNodeConfig,
	mnemonicAccountFromEnvironment,
} from "@algorandfoundation/algokit-utils";

export const getAlgoNetwork = () => process.env.ALGO_NETWORK;
export const algod = getAlgoClient(getAlgoNodeConfig(getAlgoNetwork().toLowerCase() as any, "algod"));
export const indexer = getAlgoIndexerClient(getAlgoNodeConfig(getAlgoNetwork().toLowerCase() as any, "indexer"));
export const getAccountName = (type: "admin" | "user") => `POTR_${getAlgoNetwork()}_${type}`.toUpperCase();

export function getAdminAcc() {
	return mnemonicAccountFromEnvironment(getAccountName("admin"), algod);
}

export async function getPotrAsaIdsInWallet(account: string) {
	const accountAssets = await indexer.lookupAccountAssets(account).do();
	return accountAssets.assets.map((a) => a["asset-id"]);
}
