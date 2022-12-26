# Execution Steps

## Setup

1. Go to `/src/utils/.sectrets.ts` and add mnemonic and nft storage key
2. Check if there are ids inside of `/src/output/asaIds.json`, if so run

    ```
    npm run clean-nfts
    ```

## Execution

1. Mint the POTR coins by running
    ```
    npm run mint-coins
    ```
2. Open `/src/index.ipnyb` and run all cells
    - This will create all of the nfts inside `/nfts`
    - Populate `/src/output/metadata.json` and `/src/output/traitStats.json`
3. Mint and pin all of the nfts by running

    ```
    npm run mint-nfts
    ```

### More Info

`/src/output/traitStats.json` - the number of each trait that was produced during the 1st step in `Execution`

`/src/output/metadata.json` - the traits for all of the nfts created in the 1st step of `Execution`

`/src/input/traitWeights.json` - all of the traits and their respective rarities
