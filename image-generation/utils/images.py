from .constants import BG_PATH, CLASS_PATH, NONE_PATH, ASSET_BASE_PATH, TRAIT_TYPES, NUM_POTRS, NFT_PATH
from .traits import TRAIT_WEIGHTS, generate_file_name
from PIL import Image

def trait_to_img(tr: str): return f"{tr.replace(' ', '_').lower()}.png"

def get_bg_img_path(bg_name: str): return f"{BG_PATH}/{trait_to_img(bg_name)}"

# class image only matters for things that are humanoid or phantom
def get_class_img_path(class_name: str): return f"{CLASS_PATH}/{trait_to_img(class_name)}";

def generate_layers(traits):
    # general utility for getting asset image path
    def get_trait_img_path(trait_type: str):
        trait = traits[trait_type]
        # return none default if trait is "none"
        if trait == "None": return NONE_PATH
        # the class path needs to be resolved
        return f"{ASSET_BASE_PATH}/Humanoid/{trait_type.lower()}/{trait_to_img(trait)}"
    
    layers = {
        "Class": Image.open(get_class_img_path(traits["Class"])).convert('RGBA'),
        "Background": Image.open(get_bg_img_path(traits["Background"])).convert('RGBA'),
        "Body": Image.open(get_trait_img_path("Body")).convert('RGBA'),
        "Head": Image.open(get_trait_img_path("Head")).convert('RGBA'),
        "Eyes": Image.open(get_trait_img_path("Eyes")).convert('RGBA'),
        "Mouth": Image.open(get_trait_img_path("Mouth")).convert('RGBA'),
        "Back": Image.open(get_trait_img_path("Back")).convert('RGBA'),
    }
    
    return layers

def generate_dragon_layers(traits):
    # dragons wings have name based on color which does not match the trait name
    back_trait = traits["Body"] if traits["Back"] == "Dragon Wings" else traits["Back"]
    traits["Back"] = back_trait
    layers = generate_layers(traits)   
    # dragons body covers as its class
    layers["Class"] = Image.open(NONE_PATH).convert('RGBA')
    # put the correct back name back into traits
    if(traits["Back"] not in TRAIT_WEIGHTS["Back"]["Dragon"]["traits"]): traits["Back"] = "Dragon Wings"
    return layers

def generate_golem_layers(traits):
    # golem back spikes have name based on color which does not match the trait name
    back_trait = traits["Body"] if traits["Back"] == "Spikes" else traits["Back"]
    traits["Back"] = back_trait
    layers = generate_layers(traits)   
    # golem body covers as its class
    layers["Class"] = Image.open(NONE_PATH).convert('RGBA')
    # put the correct back name back into traits
    if(traits["Back"] not in TRAIT_WEIGHTS["Back"]["Golem"]["traits"]): traits["Back"] = "Spikes"
    return layers


#  this takes the layers and creates an actual image
def create_image_composite(traits, layers):
    trait_types = TRAIT_TYPES.copy()
    
    # create first layer
    potr = Image.alpha_composite(layers["Background"], layers["Back"]);
    
    # remove used layers
    trait_types.remove("Background")
    trait_types.remove("Back")
    
    # add rest of layers
    for type in trait_types:
        potr = Image.alpha_composite(potr, layers[type])
        
    # Convert to RGB so there is no opacity aspect
    potr = potr.convert('RGB')
    return potr

def generate_nfts(metadata, n = NUM_POTRS):
    idx = 1
    for traits in metadata[:n]:
        layers = generate_layers(traits)

        # create composite images
        potr = create_image_composite(traits, layers)
        
        # save the new image file
        potr.save(f"{NFT_PATH}/{generate_file_name(idx)}.png")

        # increment counter
        idx+=1