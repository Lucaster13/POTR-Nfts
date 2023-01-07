import { CIDString } from "nft.storage";
import { AsaId, CoinType } from "./assets";

interface Cids {
    potr: [{ cid: CIDString; idx: number }];
    coin: [{ cid: CIDString; idx: CoinType }];
}

interface AsaIds {
    potr: AsaId[];
    coin: AsaId[];
}

export { Cids, AsaIds };
