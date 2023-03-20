import { AsaId } from "./network";

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
    Power: number;
    Level: number;
}

interface Arc69Metadata {
    standard: "arc69";
    description: string;
    external_url: string;
    mime_type: "image/png";
    properties: PotrTraits | {};
}

interface PotrMetadata {
    name: string;
    unitName: string;
    id: AsaId;
    url: string;
    balance: number;
    description: string;
    traits: PotrTraits;
}

export { PotrTraits, Arc69Metadata, TraitType, TraitValue, BaseClassType, ClassType, PotrMetadata };
