import { deleteAsa, getAdminAcc, getAsaIds, isAsaIdArray, setAsaIds } from "./utils";

/*
    DESTROY ALL COINS
*/
(async () => {
    // get admin account
    const admin = await getAdminAcc();
    const coinAsaIds = getAsaIds().coin;

    // if no ids, stop
    if (!isAsaIdArray(coinAsaIds) || !coinAsaIds.length) return;

    // attempt to delete assets
    await Promise.all(
        coinAsaIds.map((id) =>
            deleteAsa(admin, id)
                .catch((e) => console.error(`failed to delete ${id} ${e.message}`))
                .finally(() => id)
        )
    );

    // remove coins and update asaIds json
    setAsaIds({ coin: [] });

    console.log(`Deleted Coins successfully`);
})();
