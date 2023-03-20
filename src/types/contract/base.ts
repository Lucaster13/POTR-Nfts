import { BigNumber, ContractId, NetworkAddress } from "../network";

/*

    BASE CONTRACT TYPES

*/
type ContractName = "coin_shop" | "summon";

// can be extended by any contract participant interface to enable logging
interface ParticipantInterface {
    // for console logger
    log?: any;
}

// interface used by deployer to deploy contract (each contract can extend this type)
interface DeployerInterface extends ParticipantInterface {
    // function that gets called when contract is deployed
    deployed: (ctcId: BigNumber, ctcAddr: NetworkAddress) => void;
}

interface ContractHandle {
    getInfo: () => Promise<ContractId>;
}

type ApiFn = (...x: any) => Promise<Maybe<any>>;

type Maybe<T> = ["Some" | "None", T];

export { ContractName, DeployerInterface, ParticipantInterface, Maybe, ContractHandle, ApiFn };
