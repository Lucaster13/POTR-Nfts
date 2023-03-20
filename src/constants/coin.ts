// Weights for determining rarity of potr to summon
const COIN_RARITY_WEIGHTS = {
    bronze: 0.1,
    silver: 0.3,
    gold: 1.0,
};

const enum Coin {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
}

// convenience for ease of use with high order functions
const COIN_TYPES: Coin[] = [Coin.BRONZE, Coin.SILVER, Coin.GOLD];

export { COIN_RARITY_WEIGHTS, COIN_TYPES, Coin };
