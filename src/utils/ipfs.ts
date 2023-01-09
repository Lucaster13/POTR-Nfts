// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage } from "nft.storage";
import { NFT_STORAGE_API_KEY } from "./.secrets.js";
import { IPFS_PATH_PREFIX } from "./constants.js";
import { getCids } from "./data.js";
import { CoinType } from "../types/assets.js";

// create nft storage
const getNftStorage = () => new NFTStorage({ token: NFT_STORAGE_API_KEY });
const getPotrIpfsUrl = (fileName: string) => `${IPFS_PATH_PREFIX}${getCids().potr}${fileName}`;
const getCoinIpfsUrl = (coin: CoinType) => `${IPFS_PATH_PREFIX}${getCids().coin}/${coin}.png`;

export { getNftStorage, getPotrIpfsUrl, getCoinIpfsUrl };
