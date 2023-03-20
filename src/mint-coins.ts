import { Coin, COIN_TYPES, REACH_NETWORK } from "./constants";
import { getAdminAcc, getAsaIds, getCids, setAsaIds } from "./utils";
import mintCoin from "./utils/mint-coin";

(async () => {
    const admin = await getAdminAcc();

    if (!getCids().coin.length) {
        console.log("No cids for coins to mint with");
        return;
    }

    // for each coin cid, mint the coin
    await Promise.all(COIN_TYPES.map((coinType) => mintCoin(admin, coinType as Coin)))
        .then((asaIds) => setAsaIds({ coin: asaIds }))
        .then(() => console.log("Success minting coins", getAsaIds()[REACH_NETWORK].coin));
})();
