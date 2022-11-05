import { ReachAccount, ReachContract } from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";
import { Event, EventStream, Maybe } from "@reach-sh/stdlib/dist/types/shared_impl";

type ReachStdlib = ReturnType<typeof loadStdlib>;
type ReachEvent<T> = Event<T>;
type ReachEventStream<T> = EventStream<T>;
type ReachContractHandler = ReachContract<any>;
interface ReachSession {
    account: null | ReachAccount;
    address: string;
    balance: string;
}
type ReachApiFn<A, T> = {
    (...args: A[]): Promise<Maybe<T>>;
};
type ReachView<T> = ReachApiFn<T, any>;

interface ReachNetworkAccount {
    [x: string]: any;
    addr?: string;
    address?: string;
}

export { ReachStdlib, ReachEvent, ReachSession, ReachEventStream, ReachContractHandler, ReachApiFn, ReachNetworkAccount, ReachView };
