import { Maybe } from "@reach-sh/stdlib/dist/types/shared_impl";
import Bottleneck from "bottleneck";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const makeRateLimiter = (rps = 60, threads: number | null = null) => new Bottleneck({ minTime: 1000 / rps, maxConcurrent: threads });
const fromMaybe = (maybe: Maybe<any>) => maybe.some;

export { makeRateLimiter, wait, fromMaybe };
