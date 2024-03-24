import { makeRateLimiter, nftStorageConfig } from "potr-common";
import { NFTStorage } from "nft.storage";
import { safeCall } from "./utils";

const nftStorageRateLimiter = makeRateLimiter(...nftStorageConfig.tps);
const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
const unpin = (cid: string) => safeCall(nftStorageRateLimiter.wrap(() => nftStorage.delete(cid)));
const pin = (nft: File) => safeCall(nftStorageRateLimiter.wrap(() => nftStorage.storeBlob(nft)));

export { unpin, pin };
