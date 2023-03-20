import { TraitType } from "../types";

const RARE_BACKGROUND = ["Gold", "POTR"];
const RARE_CLASS = ["Phantom", "Archangel", "Golem", "Dragon"];
const RARE_BODY = ["Flame", "Frost", "God Armor", "Angel Light", "Radioactive"];
const RARE_HEAD = ["Master Hood", "Gandalf", "Robinhood", "Santa", "Crown"];
const RARE_EYES = ["VR", "Closed", "3D", "Thug Life"];
const RARE_TRAITS = {
    Background: RARE_BACKGROUND,
    Class: RARE_CLASS,
    Body: RARE_BODY,
    Head: RARE_HEAD,
    Eyes: RARE_EYES,
};

const TRAIT_TYPES: TraitType[] = ["Background", "Class", "Body", "Head", "Eyes", "Mouth", "Back"];
const CLASS_DEPENDENT_TRAIT_TYPES = TRAIT_TYPES.slice(2);

export { RARE_TRAITS, TRAIT_TYPES, CLASS_DEPENDENT_TRAIT_TYPES };
