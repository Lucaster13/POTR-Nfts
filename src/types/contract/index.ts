import { CoinShopEvent } from "./coin-shop";

type ContractEventType = CoinShopEvent;
interface ContractEvent<T> {
    type: ContractEventType;
    time: number;
    data: T;
}

export * from "./base";
export * from "./coin-shop";
export * from "./summon";
export { ContractEventType, ContractEvent };
