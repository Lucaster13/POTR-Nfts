import { createReachAPI } from "@jackcom/reachduck";

export default async function createFundedTestAccount(bal = 100) {
    const reach = createReachAPI();
    const testAcc = await reach.newTestAccount(reach.parseCurrency(bal));
    return testAcc;
}
