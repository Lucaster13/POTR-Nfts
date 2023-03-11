import { NFTStorage } from "nft.storage";
import { CoinType } from "potr-types";
import { IPFS_PREFIX, IPFS_URL_PREFIX, NFT_STORAGE_API_KEY } from "../constants";
import { getCids } from "./data.js";

// create nft storage
const getNftStorage = () => new NFTStorage({ token: NFT_STORAGE_API_KEY });
const getPotrIpfsUrl = (fileName: string) => `${IPFS_PREFIX}${getCids().potr}/${fileName}.png`;
const getCoinIpfsUrl = (coin: CoinType) => `${IPFS_URL_PREFIX}${getCids().coin}/${coin}.png`;

export { getNftStorage, getPotrIpfsUrl, getCoinIpfsUrl };
