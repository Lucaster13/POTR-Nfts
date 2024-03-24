
from .json import read_json_file, write_json_file
from .constants import TRAIT_TYPES, NUM_POTRS
import random
from functools import reduce
from math import log
from hashlib import sha256

# trait data consists of two arrays: [trait_names, trait_rarity_percentage]
TRAIT_WEIGHTS = read_json_file("trait-weights")

def get_random_trait(type: str): 
    # get resolved class name to find trait in trait type info
    type_info = TRAIT_WEIGHTS[type]
    
    # chose first random trait returned
    return random.choices(type_info["traits"], type_info["weights"])[0]

def generate_file_name(potrNum: int):
    return f"POTR{str(potrNum).zfill(4)}"

# reducer that goes thru all potr traits and tallies each one into an object
def trait_count_reducer(count: int, curr_traits: object): 
    for trait_type in TRAIT_TYPES:
        trait_name = curr_traits[trait_type]
        
        # init count for trait_type
        if(trait_type not in count): count[trait_type] = {}
        
        # init count for trait
        if(trait_name not in count[trait_type]):
            count[trait_type][trait_name] = 1 
            continue;

        # increment
        count[trait_type][trait_name] += 1
    return count

# same thing as above but with power
def power_count_reducer(count: int, curr_traits: int): 
    # get power
    power = curr_traits["Power"]
    
    # init count for power
    if(power not in count): count[power] = 0

    # increment
    count[power]+= 1
    
    return count
        
# reducer that calculates the actual rarity for each trait, stats starts as trait_counts
def trait_true_rarity_reducer(stats: object, trait_type: str):
    # iterate over trait names and counts in category
    for trait_name, count in stats[trait_type].items():
        # calculate the rarity fraction of trait
        true_rarity = round(count * 100 / NUM_POTRS, 3)
        # add true rarity to stats
        stats[trait_type][trait_name] = [count, true_rarity]
    return stats

def get_trait_counts(md: object): return reduce(trait_count_reducer, md, {})

# loop thru potr metadata and confirm against constraints
def check_metadata_is_valid(md):
    counts = get_trait_counts(md)
    
    # otehr important constraints
    thug_life_eyes_count = counts["Eyes"].get("Thug Life") or 0
    
    if thug_life_eyes_count > 10: return False
    
    # all constraints pass return true
    return True

# calculate power contribution for a single trait
def calc_power_contribution(traits, trait_type, base_power_weight, trait_true_rarities):
    trait_name = traits[trait_type]
    trait_rarity =  trait_true_rarities[trait_type][trait_name][1]
    # normalize trait rarity and multiply by base
    rarity_multiplier = 1 / (trait_rarity / 100)
    return base_power_weight * log(rarity_multiplier)   

# generate all potr metadata
def generate_potr_metadata(n: int):
    metadata = []
    filenames = []
    i = 0
    while i < n:
        # generate traits
        potr_metadata = {
            "Background": get_random_trait("Background"),
            "Class": get_random_trait("Class"),
            "Body": get_random_trait("Body"),
            "Head": get_random_trait("Head"),
            "Eyes": get_random_trait("Eyes"),
            "Mouth": get_random_trait("Mouth"),
            "Back":  get_random_trait("Back"),
            "Level": 1
        }
        
        # loop again if traits exist
        filename = generate_file_name(potr_metadata)
        if(filename in filenames): continue;
        
        # add filename and metadata to list
        filenames.append(filename)
        metadata.append(potr_metadata)
        i += 1

        # redo this iteration if constraint is broken
        if not check_metadata_is_valid(metadata):
            metadata.pop()
            filenames.pop()
            i -= 1
            
    # get trait counts and transform into true rarities
    trait_counts = reduce(trait_count_reducer, metadata, {})
    trait_true_rarities = reduce(trait_true_rarity_reducer, TRAIT_TYPES, trait_counts)
    
    # write traits and rarities to json 
    write_json_file(metadata, "metadata")
    write_json_file(trait_true_rarities, "trait-true-rarities")
    
    # checks to see if everything worked properly
    filenames = [generate_file_name(traits) for traits in metadata]
    print(f"number of potrs: {len(metadata)}")
    print(f"number of filenames generated: {len(filenames)}")
    print(f"number of unique filenames: {len(set(filenames))}")
    
    # return metadata once all of the requested objects have been made
    return metadata