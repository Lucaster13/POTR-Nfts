import { REACH_NETWORK } from "./reach";

/*

    ALGO SDK CONFIG

*/
const token = "";
const server = `https://${REACH_NETWORK.toLowerCase()}-api.algonode.cloud`;
const port = 443;
const ALGOSDK_PARAMS = [token, server, port];

export { ALGOSDK_PARAMS };
