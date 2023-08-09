import { NFTStorage } from "nft.storage";
import { CIDS, Coin, IPFS_URL_PREFIX } from "potr-common";
import { NFT_STORAGE_API_KEY } from "../constants/.secrets";

// create nft storage
const getNftStorage = () => new NFTStorage({ token: NFT_STORAGE_API_KEY });
const getPotrIpfsUrl = (fileName: string) => `${IPFS_URL_PREFIX}${CIDS.potr}/${fileName}.png`;
const getCoinIpfsUrl = (coin: Coin) => `${IPFS_URL_PREFIX}${CIDS.coin}/${coin}.png`;

export { getNftStorage, getPotrIpfsUrl, getCoinIpfsUrl };
