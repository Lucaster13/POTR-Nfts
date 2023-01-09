import { AsaIds, Cids, PotrTraits } from "potr-utils/types";
import { readFromJson, writeToJson } from "./json";

const getCids = () => readFromJson<Cids>("cids");
const getAsaIds = () => readFromJson<AsaIds>("asa-ids");
const getMetadata = () => readFromJson<PotrTraits[]>("metadata");

const setCid = (cid: Partial<Cids>) => writeToJson({ ...getCids(), ...cid }, "cids");
const setAsaIds = (asaIds: Partial<AsaIds>) => writeToJson({ ...getAsaIds(), ...asaIds }, "asa-ids");

export { getCids, getAsaIds, getMetadata, setCid, setAsaIds };
