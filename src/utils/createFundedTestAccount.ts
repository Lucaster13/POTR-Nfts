import { createReachAPI, ReachAccount } from "@jackcom/reachduck";

export default async (bal = 100): Promise<ReachAccount> => {
    const reach = createReachAPI();
    const testAcc = await reach.newTestAccount(reach.parseCurrency(bal));
    return testAcc;
};
