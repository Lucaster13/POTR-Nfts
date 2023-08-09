import { makeReach, REACH_NETWORK, ReachAccountT } from "potr-common";
import { ACCOUNTS } from "../constants/.secrets";

export default async (): Promise<ReachAccountT> => {
	const reach = makeReach();
	const admin: ReachAccountT = await reach.newAccountFromMnemonic(ACCOUNTS[REACH_NETWORK].admin.mnemonic);
	return admin;
};
