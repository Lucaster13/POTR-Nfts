import { AsaId, ContractId } from "./network";

interface Cids {
    potr: string;
    coin: string;
}

interface AsaIds {
    TestNet: {
        potr: AsaId[];
        coin: AsaId[];
    };
    MainNet: {
        potr: AsaId[];
        coin: AsaId[];
    };
}

interface ContractIds {
    TestNet: { coin_shop: ContractId };
    MainNet: { coin_shop: ContractId };
}

export { Cids, AsaIds, ContractIds };
