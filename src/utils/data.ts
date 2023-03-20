import { REACH_NETWORK } from "../constants";
import { AsaIds, Cids, PotrTraits } from "../types";
import { readFromJson, writeToJson } from "./json";

const getCids = () => readFromJson<Cids>("cids");
const getAsaIds = () => readFromJson<AsaIds>("asa-ids");
const getMetadata = () => readFromJson<PotrTraits[]>("metadata");

const setCid = (cid: Partial<Cids>) => writeToJson({ ...getCids(), ...cid }, "cids");
const setAsaIds = (asaIds: Partial<AsaIds["TestNet"]>) => {
    const asaIdsJson = getAsaIds();
    asaIdsJson[REACH_NETWORK] = { ...asaIdsJson[REACH_NETWORK], ...asaIds };
    writeToJson(asaIdsJson, "asa-ids");
};

export { getCids, getAsaIds, getMetadata, setCid, setAsaIds };
