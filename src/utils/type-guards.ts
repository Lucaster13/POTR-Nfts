import { CIDString } from "nft.storage";
import { AsaIdT } from "potr-common";

const isAsaId = (id: any): id is AsaIdT => Number.isInteger(id);
const isAsaIdArray = (arr: any): arr is AsaIdT[] => {
	if (!Array.isArray(arr)) return false;
	if (!arr.length) return false;

	return arr.filter((id) => isAsaId(id)).length > 0;
};

const isCid = (cid: any): cid is CIDString => typeof cid === "string";
const isCidArray = (arr: any): arr is CIDString[] => {
	if (!Array.isArray(arr)) return false;
	if (!arr.length) return false;

	return arr.filter((cid) => isCid(cid)).length > 0;
};

const isError = (e: any): e is Error => e.message !== undefined;

export { isAsaId, isAsaIdArray, isCid, isCidArray, isError };
