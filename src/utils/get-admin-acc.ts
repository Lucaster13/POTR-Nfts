import { ACCOUNTS, REACH_NETWORK } from "../constants";
import { ReachAccount } from "../types";
import { createReachApi } from "./stdlib";

export default async (): Promise<ReachAccount> => {
    const reach = createReachApi();
    const admin: ReachAccount = await reach.newAccountFromMnemonic(ACCOUNTS[REACH_NETWORK].admin.mnemonic);
    return admin;
};
