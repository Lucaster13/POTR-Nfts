import { loadStdlib } from "@reach-sh/stdlib";

export const reach = loadStdlib("ALGO-devnet");

export const COIN_SUPPLY = [
    reach.bigNumberify(1000),
    reach.bigNumberify(400),
    reach.bigNumberify(100),
];

// algo consts
export const TXN_FEE = 1000; // microalgos
export const OPT_IN_FEE = 100000; // microalgos

// reach consts
export const REACH_NETWORK = "TestNet";
export const REACH_PROVIDER_ENV = {
    REACH_CONNECTOR_MODE: "ALGO",
    REACH_ISOLATED_NETWORK: "yes",
};

/*

    ERROR MESSAGES

*/
export const ERROR_MSGS = {
    balNotEnough: "balance insufficient for transaction",
    illegalArgs: "illegal param(s) were provided",
    ctcInactive: "contract is currently inactive",
    notPermitted: "action not permitted",
    notAuthorized: "action not authorized",
    depositOverflow: "deposit causes balance to overflow",
};
export const ERROR_MSG_REGEX = {
    outOfRange: /.*out of range.*/,
    nullParam: /.*Expected.*but got null.*/,
    assertFail: /.*Assertion failed.*/,
    noOptIn: /.*asset.*missing.*/,
    ctcDoesNotExist: /.*only clearing out is supported for applications that do not exist.*/,
};

/*

    TIMING CONSTANTS

 */
export const SECS_PER_MIN = 60;
export const SECS_PER_HOUR = 60 * SECS_PER_MIN;
export const SECS_PER_DAY = 24 * SECS_PER_HOUR;
export const SECS_PER_BLOCK = 5;

/*

    ALGO SDK CONFIG

*/
const token = "";
const server = `https://${REACH_NETWORK.toLowerCase()}-api.algonode.cloud`;
const port = 443;
export const ALGOSDK_PARAMS = [
    token,
    server,
    port,
];
