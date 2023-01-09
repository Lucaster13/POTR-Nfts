# Execution Steps

## Setup

1. Go to `/src/utils/.secrets.ts` and add mnemonic and nft storage key
2. Check if there are ids inside of `/src/data/asa-ids.json`, if so run

    ```
    npm run clean-nfts
    ```

## Execution

1. Mint the POTR coins by running
    ```
    npm run mint-coins
    ```
2. Open `/src/image-generation/index.ipnyb` and run all cells
    - This will create all of the nfts inside `/src/image-generation/nfts`
    - Populate `/src/data/metadata.json` and `/src/data/trait-true-rarities.json`
3. Mint and pin all of the nfts by running
    ```
    npm run mint-nfts
    ```

### More Info

`/src/data/trait-true-rarities.json` - the count and true rarity of each trait that was produced during the 2nd step in `Execution`

`/src/data/metadata.json` - the traits for all of the nfts created in the 1st step of `Execution`

`/src/data/trait-weights.json` - all of the traits and their respective rarities
