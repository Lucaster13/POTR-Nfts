import { getAdminAcc, getAsaIds, getMetadata, mintPotr, setAsaIds } from "./utils";
import { getPotrFilesArr } from "./utils/files";

// MINTS ALL ASSETS IN CIDS OBJECT
(async () => {
    const admin = await getAdminAcc();

    const potrMetadata = getMetadata();
    const potrFiles = await getPotrFilesArr();

    console.log("minting", potrFiles.length, "potrs");

    const retries = await Promise.all(
        potrFiles.map(({ name }, idx) =>
            mintPotr(admin, idx + 1, potrMetadata[idx]) // only add asaId if it does not exist
                .then((asaId) => !getAsaIds().potr.includes(asaId) && setAsaIds({ potr: [...getAsaIds().potr, asaId] }))
                .then(() => {
                    console.log("Successfully updated potr asa ids, num ids:", getAsaIds().potr.length);
                    return null;
                })
                .catch((e) => {
                    console.error(e.message);
                    return { name, idx };
                })
        )
    );

    console.log("potr asa ids successfully written to json:", getAsaIds().potr.length);

    console.log(
        "failed to mint the following:",
        retries.filter((retry) => retry)
    );
})();
