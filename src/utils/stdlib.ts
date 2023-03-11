import { loadStdlib } from "@reach-sh/stdlib";
import { REACH_STDLIB_ENV } from "../constants";

const createReachApi = () => loadStdlib(REACH_STDLIB_ENV);

export { createReachApi };
