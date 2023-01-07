import { CIDString } from "nft.storage";
import { Cids, CoinType } from "./types";
import { COIN_PATH_PREFIX, COIN_TYPES, pinNFT, readFromJson, writeToJson } from "./utils";

// pins every asset inside /nfts folder to ipfs
(async () => {
    const cids: { cid: CIDString; idx: CoinType }[] = [];

    // attempt to pin all assets
    await Promise.all(
        COIN_TYPES.map(async (coinType) => {
            // pin to ipfs
            const cid = await pinNFT(`${COIN_PATH_PREFIX}/${coinType}_coin.png`);
            // add to cids
            cids.push({ cid, idx: coinType });
        })
    );

    console.log(`coins pinned successfully`);

    // update cids json
    const { potr: potrCids } = readFromJson<Cids>("cids");
    writeToJson({ potr: potrCids, coin: cids }, "cids");

    console.log(`coin cids written successfully to json`);
})();
