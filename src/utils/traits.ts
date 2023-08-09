import { TRAITS, TraitsT, VisualTrait } from "potr-common";
import { CLASS_DEPENDENT_TRAIT_TYPES } from "../constants/traits";
import { TRAIT_WEIGHTS } from "../data";

// for each trait get its index in the json object and pad with one '0', then concatenate together and prepend with power
function getFileNameFromTraits(traits: TraitsT) {
	const baseClassName = getBaseClass(traits.Class);

	// get all indices for traits
	const traitIdxs = TRAITS.map((traitType) => getTraitIndex(baseClassName, traitType, traits[traitType]));

	// prepend path with power so they sort by power
	return traitIdxs.reduce(
		(filename, idx) =>
			filename +
			idx.toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			}),
		traits.Power.toString(),
	);
}

// helper that gets the index of this trait in trait_weights
function getTraitIndex(baseClassName, traitType, trait) {
	// get the list of traits for this trait type
	const { traits } = isClassDependentTraitType(traitType)
		? TRAIT_WEIGHTS[traitType][baseClassName]
		: TRAIT_WEIGHTS[traitType];
	return (traits as string[]).indexOf(trait);
}

const isHumanoid = (className: string) => !["Dragon", "Golem", "Phantom"].includes(className);
const isClassDependentTraitType = (traitType: VisualTrait) => CLASS_DEPENDENT_TRAIT_TYPES.includes(traitType);
const getBaseClass = (className: string) => (isHumanoid(className) ? "Humanoid" : className);

export { getFileNameFromTraits };
