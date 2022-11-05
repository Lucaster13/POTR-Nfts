import { TRAIT_WEIGHTS } from "../output";
import { BaseClassType, ClassType, PotrTraits, TraitType } from "../types";

const TRAIT_TYPES = Object.keys(TRAIT_WEIGHTS) as TraitType[];

// these traits require a class to determine which traits pile to choose from
const CLASS_DEPENDENT_TRAIT_TYPES: TraitType[] = ["Body", "Head", "Eyes", "Mouth", "Back"];

// resolves a given class to its base class
const getBaseClass = (name: ClassType): BaseClassType => (["Dragon", "Golem", "Phantom"].includes(name) ? (name as BaseClassType) : "Humanoid");

// these are the base weights given to each trait when calculating its contribution to overall power
const getBaseTraitPowerWeights = (baseClass: BaseClassType) => {
    const isHumanoid = baseClass === "Humanoid";
    const isPhantom = baseClass === "Phantom";
    const isGolem = baseClass === "Golem";

    return {
        Background: 100,
        Class: 600,
        Body: 400 * (isHumanoid || isPhantom ? 1 : 2),
        Head: 300 * (isHumanoid || isPhantom ? 1 : isGolem ? 2.3 : 2),
        Eyes: 200 * (isHumanoid || isPhantom ? 1 : 1.6),
        Mouth: 120,
        Back: 70 * (isHumanoid || isPhantom ? 1 : isGolem ? 2 : 1.6),
    };
};

// calculates the amount of power that a single trait will contribute to a potr's overall power
function calculateTraitPowerContribution(traits: PotrTraits, baseClass: BaseClassType, traitType: TraitType, basePowerWeight: number) {
    const isClassDependentTraitType = CLASS_DEPENDENT_TRAIT_TYPES.includes(traitType);
    const traitName = traits[traitType];

    // get the trait names and weights array's for this trait type
    const { traits: traitNames, weights: traitWeights } = !isClassDependentTraitType ? TRAIT_WEIGHTS[traitType] : TRAIT_WEIGHTS[traitType][baseClass];

    // determine the overall rarity weight of the given trait
    const traitWeight = traitWeights[traitNames.indexOf(traitName)];

    // calculate the power contribution for this trait (extra check if traitWeight is 1 as taking the log would cause the denominator to be 0)
    const powerContribution = basePowerWeight / (traitWeight === 1 ? traitWeight : Math.log(traitWeight));

    return powerContribution;
}

export function calculatePower(traits: PotrTraits) {
    const baseClass = getBaseClass(traits.Class);
    // get the base power weights for each trait for this base class
    const baseTraitPowerWeights = getBaseTraitPowerWeights(baseClass);
    // determine the amount of power each trait contributes to this potr's overall power
    const traitPowerContributions = TRAIT_TYPES.map((traitType) => calculateTraitPowerContribution(traits, baseClass, traitType, baseTraitPowerWeights[traitType]));
    // sum all the power contributions
    const power = Math.round(traitPowerContributions.reduce((totalPower, traitPower) => totalPower + traitPower, 0));

    return power;
}

// get the traits of a potr from its file prefix code
export function getTraitsFromFilePrefix(filePrefix: string): PotrTraits {
    // parse indices for each trait type
    const traitIdxs = {
        Background: Number(filePrefix.substring(0, 2)),
        Class: Number(filePrefix.substring(2, 4)),
        Body: Number(filePrefix.substring(4, 6)),
        Head: Number(filePrefix.substring(6, 8)),
        Eyes: Number(filePrefix.substring(8, 10)),
        Mouth: Number(filePrefix.substring(10, 12)),
        Back: Number(filePrefix.substring(12, 14)),
    };

    // determine background and class first
    const traits: PotrTraits = {
        Background: TRAIT_WEIGHTS.Background.traits[traitIdxs.Background],
        Class: TRAIT_WEIGHTS.Class.traits[traitIdxs.Class] as ClassType,
        Body: "",
        Head: "",
        Eyes: "",
        Mouth: "",
        Back: "",
    };

    // determine the rest of the traits and add them to traits object
    Tr.forEach((traitType) => {
        const baseClass = getBaseClass(traits.Class);
        const traitIdx = traitIdxs[traitType];
        traits[traitType] = TRAIT_WEIGHTS[traitType][baseClass].traits[traitIdx];
    });

    return {
        ...traits,
        Power: calculatePower(traits),
    };
}

// parses the potr file prefix code from a path and then determines its traits
export function getTraitsFromStaticPath(path: string) {
    if (!path) {
        return {
            Background: "N/A",
            Class: "N/A",
            Body: "N/A",
            Head: "N/A",
            Eyes: "N/A",
            Mouth: "N/A",
            Back: "N/A",
        };
    }

    const fileName = path.split("/")[path.split("/").length - 1];
    const filePrefix = fileName.split(".")[0];
    return getTraitsFromFilePrefix(filePrefix);
}
