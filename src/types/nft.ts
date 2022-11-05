import { AsaId } from "./assets";

type TraitValue = string | number;
type TraitType = "Background" | "Class" | "Body" | "Head" | "Eyes" | "Mouth" | "Back" | "Power";
type BaseClassType = "Humanoid" | "Phantom" | "Golem" | "Dragon";
type ClassType = "Berserker" | "Ranger" | "Wizard" | "Crusader" | "Necromancer" | "Assassin" | "Phantom" | "Archangel" | "Dragon" | "Golem";

interface PotrTraits {
    Background: string;
    Class: ClassType;
    Body: string;
    Head: string;
    Eyes: string;
    Mouth: string;
    Back: string;
    [x: string]: string | number;
}

interface NftMetadata {
    symbol?: string;
    cid?: string;
    id: AsaId;
    properties?: PotrTraits;
    refresh?: boolean;
}

export { PotrTraits, NftMetadata, TraitType, TraitValue, BaseClassType, ClassType };
