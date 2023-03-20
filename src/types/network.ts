import { loadStdlib } from "@reach-sh/stdlib";
import { Time } from "@reach-sh/stdlib/dist/types/shared_impl";

type ReachStdlib = ReturnType<typeof loadStdlib>;
type BigNumber = Time;
type AsaId = number;
type ContractId = number;
type NetworkAddress = string;
interface NetworkAccount {
    [x: string]: any;
    addr?: string;
    address?: NetworkAddress;
}
interface ReachAccount {
    [x: string]: any;
    networkAccount: NetworkAccount;
    contract: <T>(b: any, info?: ContractId | BigNumber) => Promise<T>;
    balanceOf: (asa?: AsaId) => Promise<BigNumber>;
    acceptToken: (asa: AsaId) => Promise<void>;
    tokenAccepted: (asa: AsaId) => Promise<boolean>;
}

export { BigNumber, AsaId, ContractId, NetworkAddress, NetworkAccount, ReachAccount, ReachStdlib };
