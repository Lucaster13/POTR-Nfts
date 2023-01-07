ASSET_BASE_PATH = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/image-generation/assets/images"
DATA_PATH = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/data"
NFT_PATH = "/Users/lucasterr/Documents/_code/Protectors-Of-The-Rand/POTR-Nfts/src/image-generation/nfts"
NONE_PATH = f"{ASSET_BASE_PATH}/_none.png"
BG_PATH = f"{ASSET_BASE_PATH}/background"
CLASS_PATH = f"{ASSET_BASE_PATH}/class"
NUM_POTRS = 6000
TRAIT_TYPES = ["Background", "Class", "Body", "Head", "Eyes", "Mouth", "Back"]
# Background and class are the only types that dont rely on class to generate
CLASS_DEPENDENT_TRAIT_TYPES = TRAIT_TYPES[2:]