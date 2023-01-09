import { filesFromPath, getFilesFromPath } from "files-from-path";
import path from "path";
import { COIN_PATH_PREFIX, NFT_PATH_PREFIX } from "./constants";

const coinFilesObj = filesFromPath(COIN_PATH_PREFIX, {
    pathPrefix: path.resolve(COIN_PATH_PREFIX),
});

const potrFilesObj = filesFromPath(NFT_PATH_PREFIX, {
    pathPrefix: path.resolve(NFT_PATH_PREFIX),
});

const getCoinFilesArr = () =>
    getFilesFromPath(COIN_PATH_PREFIX, {
        pathPrefix: path.resolve(COIN_PATH_PREFIX),
    });

const getPotrFilesArr = () =>
    getFilesFromPath(NFT_PATH_PREFIX, {
        pathPrefix: path.resolve(NFT_PATH_PREFIX),
    });

export { coinFilesObj, potrFilesObj, getCoinFilesArr, getPotrFilesArr };
