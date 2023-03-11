import { deleteAsa, getAdminAcc, getAsaIds, isAsaIdArray, setAsaIds } from "./utils";

/*
    DESTROY ALL POTRS

    reads asa ids json and tries to destroy all potrs that exist
*/
(async () => {
    // get admin account
    const admin = await getAdminAcc();

    // read potr asa ids
    const potrAsaIds = getAsaIds().potr;

    // if no ids, return
    if (!isAsaIdArray(potrAsaIds) || !potrAsaIds.length) throw new Error("No Potrs to destroy");

    let potrsDeleted = 0;

    // attempt to delete assets
    await Promise.all(
        potrAsaIds.map((asaId) =>
            deleteAsa(admin, asaId)
                .then(() => setAsaIds({ potr: getAsaIds().potr.filter((id) => id !== asaId) }))
                .then(() => potrsDeleted++)
                .catch((e) => console.error(e.message))
        )
    );

    console.log("finished deleting assets total:", potrsDeleted);
})();
