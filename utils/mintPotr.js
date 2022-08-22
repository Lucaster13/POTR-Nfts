import mintAsa from "./mintAsa.js";

export default async function mintPotr(id, cid, traits) {
    try {
        // create traits metadata object
        const idString = String(id).padStart(4, "0");
        const metadata = {
            standard: "arc69",
            description: `Protector of the Rand #${idString}`,
            external_url: "protectorsoftherand.com",
            mime_type: "image/png",
            properties: traits,
        };
        // encode the metadata for asset note
        const encodedNote = new TextEncoder().encode(JSON.stringify(metadata));
        // mint potr
        asaId = await mintAsa({
            acc: adminAcc,
            supply: 1,
            sym: `POTR${idString}`,
            name: `Protector ${idString}`,
            url: `ipfs://${cid}`,
            note: encodedNote,
        });
        // return asa id and cid
        return { asaId, cid };
    } catch (e) {
        throw new Error(e);
    }
}
