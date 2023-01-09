import { CIDString } from "nft.storage";
import { AsaId } from "./assets";

interface Cids {
    potr: CIDString;
    coin: CIDString;
}

interface AsaIds {
    potr: AsaId[];
    coin: AsaId[];
}

export { Cids, AsaIds };
