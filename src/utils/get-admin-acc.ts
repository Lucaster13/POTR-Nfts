import { ReachAccount } from "potr-types";
import { RAND_KINGDOM_MNEMONIC } from "../constants";
import { createReachApi } from "./stdlib";

export default async (): Promise<ReachAccount> => {
    const reach = createReachApi();
    const admin: ReachAccount = await reach.newAccountFromMnemonic(RAND_KINGDOM_MNEMONIC);
    return admin;
};
