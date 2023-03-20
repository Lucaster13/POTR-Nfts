import { AsaId } from "../network";
import { DeployerInterface, ContractHandle, ParticipantInterface } from "./base";

/*

    SUMMON CONTRACT TYPES

*/

// Interface for running contract as admin
interface SummonAdminInterface extends ParticipantInterface {
    // determines which potr to send based on coin type
    get_potr: (coin: AsaId) => Promise<AsaId> | AsaId;
}

// interface for connecting as a summoner
interface SummonSummonerInterface extends DeployerInterface {
    // the asa id of the payment coin
    coin: AsaId;
    // does opt in and returns status of opt-in
    claim: (potrId: AsaId) => Promise<boolean>;
    show_event: (task: string, info: string) => Promise<void> | void;
}

// names for participants
type SummonParticipant = "Admin" | "Summoner";

interface SummonHandle extends ContractHandle {
    p: {
        Admin: (int: SummonAdminInterface) => Promise<void>;
        Summoner: (int: SummonSummonerInterface) => Promise<void>;
    };
}

export { SummonAdminInterface, SummonSummonerInterface, SummonParticipant, SummonHandle };
