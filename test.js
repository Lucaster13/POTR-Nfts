import { getTraitsFromStaticPath } from "./traits.js";

const traits = files.map(getTraitsFromStaticPath);

const metadata = traits.map((t, idx) => {
    const idNum = Math.round(Math.random() * 4000);
    return {
        name: `Protector ${idNum}`, symbol: `POTR${idNum}`, url: files[idx], properties: t
    };
});

console.log(metadata);
