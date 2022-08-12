import { execFile } from "child_process";
import {
    OPT_IN_FEE,
    SECS_PER_BLOCK,
    SECS_PER_DAY,
    SECS_PER_HOUR,
    SECS_PER_MIN,
    TXN_FEE,
} from "./_constants.js";

export const execPython = (prog) => new Promise((success, error) => {
    execFile("python3", [ prog ], (err, stdout) => {
        if (err) {
            console.error(`error: ${err.message}`);
            error(err);
            return;
        }
        console.log(`successful execution of ${prog}`);
        success(stdout.split("\n").filter((x) => x.length));
    });
});

// all ctc params are for reach, the participant is the name of the deployer participant in the contracts
export const deployContract = async (deployer, ctcBackend, ctcInterface, ctcParticipant) => {
    // resolve callback for promise
    let readyResolve;
    // promise will resolve when api is ready
    const ctcReady = new Promise((res) => (readyResolve = res));

    // deploy contract
    const ctc = deployer.contract(ctcBackend);
    const deployerParticipant = ctc.p[ctcParticipant];
    const ctcInfo = [];
    deployerParticipant({
        ctcReady: (ctcId, ctcAddr) => {
            ctcInfo.push(ctcId, ctcAddr);
            readyResolve();
        }, // add in the apiReady function (MUST BE DEFINED IN INTERFACE)
        ...ctcInterface,
    });

    // await api ready
    await ctcReady;

    // [ctcId, ctcAddr]
    return ctcInfo;
};

export const attachParticipant = async (acc, name, ctcBackend, ctcId, partInterface) => {
    // attach to contract
    const ctc = acc.contract(ctcBackend, ctcId);
    const attachedCtcPromise = ctc.p[name](partInterface);
    return attachedCtcPromise;
};

export const formatView = async (view) => (await view())[1];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const BIGNUM_ZEROES = (x) => new Array(x).fill(reach.bigNumberify(0));
export const getFees = (txns, optIns) => reach.bigNumberify(txns * TXN_FEE + optIns * OPT_IN_FEE);

/*

    UTIL FUNCS FOR TIME

 */
export const minsToSecs = (m) => m * SECS_PER_MIN;
export const hoursToSecs = (h) => h * SECS_PER_HOUR;
export const daysToSecs = (d) => d * SECS_PER_DAY;
export const waitNetworkSecs = async (s) => await reach.waitUntilSecs(reach.add(await reach.getNetworkSecs(), s));
export const secsToBlocks = (s) => s / SECS_PER_BLOCK;
export const minsToBlocks = (m) => secsToBlocks(minsToSecs(m));
export const hoursToBlocks = (m) => secsToBlocks(hoursToSecs(m));
export const daysToBlocks = (m) => secsToBlocks(daysToSecs(m));

export function getRarity(coinType) {
    const max = 10000;
    const randomVal = Math.round(Math.random() * max);
    const rarityRange = Math.round(COIN_RARITY_WEIGHTS[coinType] * max);
    const isRare = randomVal <= rarityRange;
    return isRare;
}

export function findRareTraits(validIdx, traits, currIdx) {
    if (validIdx) return validIdx;

    const isRare = Object
        .keys(RARE_TRAIT_MAPPING)
        .map((type) => RARE_TRAIT_MAPPING[type].includes(traits[type]))
        .filter((rare) => rare)
        .reduce((rare, curr) => rare || curr, false);

    if (isRare) return currIdx;

    return validIdx;
}
