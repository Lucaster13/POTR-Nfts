import { CoinType } from "../types";

const POTR_URL = "protectorsoftherand.com";
const COIN_TYPES: CoinType[] = ["bronze", "silver", "gold"];

/* 

    FILE PATHS

*/
const NFT_PATH_PREFIX = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/image-generation/nfts";
const COIN_PATH_PREFIX = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/image-generation/coins";
const DATA_PATH_PREFIX = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/data";

/* 

    RARE TRAITS

*/
const RARE_BACKGROUND = ["Gold", "POTR"];
const RARE_CLASS = ["Phantom", "Archangel", "Golem", "Dragon"];
const RARE_BODY = ["Flame", "Frost", "God Armor", "Angel Light", "Radioactive"];
const RARE_HEAD = ["Master Hood", "Gandalf", "Robinhood", "Santa", "Crown"];
const RARE_EYES = ["VR", "Closed", "3D", "Thug Life"];

export default {
    Background: RARE_BACKGROUND,
    Class: RARE_CLASS,
    Body: RARE_BODY,
    Head: RARE_HEAD,
    Eyes: RARE_EYES,
};

/*

    REACH CONSTANTS

*/
const REACH_NETWORK = "TestNet";
const REACH_PROVIDER_ENV = {
    REACH_CONNECTOR_MODE: "ALGO",
    REACH_ISOLATED_NETWORK: "yes",
};

/*

    ALGO SDK CONFIG

*/
const token = "";
const server = `https://${REACH_NETWORK.toLowerCase()}-api.algonode.cloud`;
const port = 443;
const ALGOSDK_PARAMS = [token, server, port];

export { COIN_TYPES, COIN_PATH_PREFIX, NFT_PATH_PREFIX, DATA_PATH_PREFIX, POTR_URL, REACH_PROVIDER_ENV, REACH_NETWORK, ALGOSDK_PARAMS };
