import { BigNumber } from "@jackcom/reachduck";

interface AssetMetadata {
    retry?: boolean;
    id: number;
}
type AsaId = number;
type ContractId = number | BigNumber;
type CoinType = "bronze" | "silver" | "gold";
type Address = string;
type CoinArray = [BigNumber, BigNumber, BigNumber];
type CoinIdArray = [AsaId, AsaId, AsaId];
type CoinBalance = number;

export { AsaId, ContractId, CoinType, Address, CoinArray, CoinIdArray, AssetMetadata, CoinBalance };
