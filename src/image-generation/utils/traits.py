
from .json import read_json_file, write_json_file
from .constants import CLASS_DEPENDENT_TRAIT_TYPES, TRAIT_TYPES, NUM_POTRS
import random
from functools import reduce
from math import log

# trait data consists of two arrays: [trait_names, trait_rarity_percentage]
TRAIT_WEIGHTS = read_json_file("trait-weights")

def check_humanoid(class_name: str): return class_name not in ["Dragon", "Golem", "Phantom"]

def check_phantom(class_name: str): return class_name == "Phantom"

def get_base_class(class_name: str): return "Humanoid" if check_humanoid(class_name) else class_name

def check_class_dependent_trait(type: str): return type in CLASS_DEPENDENT_TRAIT_TYPES

def get_random_trait(type: str, class_name: str = None): 
    # either background or class if class name is None
    if(class_name == None): return random.choices(TRAIT_WEIGHTS[type]["traits"],TRAIT_WEIGHTS[type]["weights"])[0]
    
    # get resolved class name to find trait in trait type info
    type_info = TRAIT_WEIGHTS[type][get_base_class(class_name)]
    
    # chose first random trait returned
    return random.choices(type_info["traits"], type_info["weights"])[0]

def generate_file_name_from_traits(traits: object):
    # for each trait get its index in the json object and pad with one '0'
    base_class_name = get_base_class(traits["Class"])
    
    # get the index of this train in trait_weights
    def get_trait_index(trait_type, trait):
        trait_names: list = (TRAIT_WEIGHTS[trait_type][base_class_name] if check_class_dependent_trait(trait_type) else TRAIT_WEIGHTS[trait_type])["traits"]
        return trait_names.index(trait)
    
    # get all indices for traits
    trait_idxs = map(lambda trait_type: get_trait_index(trait_type, traits[trait_type]), TRAIT_TYPES)
    
    # prepend path with power so they sort by power
    path_name = f"{traits.get('Power')}" 
    for idx in trait_idxs:
        path_name = path_name + f"{idx:02d}"
    return path_name

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

def get_trait_counts(md: object): return  reduce(trait_count_reducer, md, {})

# loop thru potr metadata and confirm against constraints
def check_metadata_is_valid(md):
    counts = get_trait_counts
    
    # check all classes are valid under constraints
    for class_name in TRAIT_WEIGHTS["Class"]["traits"]:
        class_count = counts["Class"].get(class_name) or 0
        if class_count > TRAIT_WEIGHTS["Class"]["weights"]:
            return False
    
    # otehr important constraints
    ancient_body_count = counts["Body"].get("Ancient") or 0
    crystal_body_count = counts["Body"].get("Crystal") or 0
    thug_life_eyes_count = counts["Eyes"].get("Thug Life") or 0
    tooth_mouth_count = counts["Mouth"].get("Tooth") or 0
    
    if thug_life_eyes_count > 80: return False
    if ancient_body_count > 10: return False
    if crystal_body_count > 10: return False
    if tooth_mouth_count > 40: return False
    
    # all constraints pass return true
    return True

# calculate power contribution for a single trait
def calc_power_contribution(traits, trait_type, base_power_weight, trait_true_rarities):
    trait_name = traits[trait_type]
    trait_rarity =  trait_true_rarities[trait_type][trait_name][1]
    # normalize trait rarity and multiply by base
    rarity_multiplier = 1 / (trait_rarity / 100)
    return base_power_weight * log(rarity_multiplier)

# loop over metadata and add powers
def add_powers_to_metadata(md: list):
    ttr = read_json_file("trait-true-rarities")
    for metadata in md:
        # retrieve the power for these traits
        base_class = get_base_class(metadata["Class"]);
        is_humanoid = check_humanoid(base_class)
        is_phantom = check_phantom(base_class)
        is_special = not is_humanoid and not is_phantom
        is_golem = base_class == "Golem"
        
        # # Create weights for each trait that are multipliers to its power
        # # each trait has separate scaling factors based on the class to balance power levels
        BASE_POWER_WEIGHTS = [
            13,                                                           # background
            25 * (1 if is_special else 1.5),                                # class
            20,                                                           # body
            7,                                                            # head
            6,                                                            # eyes
            4,                                                            # mouth
            5                                                             # back
        ]
        
        # calculate the power contribution for each trait
        rarities = [calc_power_contribution(metadata, type, bpw, ttr) for type, bpw in zip(TRAIT_TYPES, BASE_POWER_WEIGHTS)]
        
        # sum powers and round
        power = round(reduce(lambda curr, tot: curr + tot, rarities))
    
        # add power to traits and add it to list of metadata
        metadata["Power"] = power
        
    # sort by descending power
    md.sort(reverse=True, key=(lambda traits: traits["Power"]))
    

# generate all potr metadata
def generate_potr_metadata(n: int):
    metadata = []
    filenames = []
    i = 0
    while i < n:
        # generate background and class first since they are exceptions
        new_background = get_random_trait("Background")
        new_class = get_random_trait("Class")
        # generate rest of traits
        potr_metadata = {
            "Background": new_background,
            "Class": new_class,
            "Body": get_random_trait("Body", new_class),
            "Head": get_random_trait("Head",new_class),
            "Eyes": get_random_trait("Eyes",new_class),
            "Mouth": get_random_trait("Mouth",new_class),
            "Back":  get_random_trait("Back",new_class)
        }
        
        # loop again if traits exist
        filename = generate_file_name_from_traits(potr_metadata)
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
    filenames = [generate_file_name_from_traits(traits) for traits in metadata]
    print(f"number of potrs: {len(metadata)}")
    print(f"number of filenames generated: {len(filenames)}")
    print(f"number of unique filenames: {len(set(filenames))}")
    
    # return metadata once all of the requested objects have been made
    return metadata