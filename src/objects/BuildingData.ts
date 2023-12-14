export type BuildingData = {
    displayName: string;
    pointsNeeded: number;
    gain: number,
    gainType: BuildingNeed,
    name: BuildingName,
    textureName: string,
    needs?: [BuildingNeed, number][]
}

export const BUILDING_NEEDS = ['nature', 'knowledge', 'water', 'sex', 'food', 'fun', 'community', 'energy', 'money'] as const

export type BuildingNeed = typeof BUILDING_NEEDS[number]

export type BuildingName = 'tent' | 'big_tent' | 'fire' | 'hut' | 'tree' | 'house' | 'tall_house' | 'court' | 'field'

export const TENT: BuildingData = {
    pointsNeeded: 0,
    gain: 1,
    gainType: "community",
    name: 'tent',
    displayName: "Tent",
    textureName: 'buildings/tent',
}
export const PINE: BuildingData = {
    pointsNeeded: 0,
    gain: 1,
    gainType: "nature",
    name: 'tree',
    displayName: "Pines",
    textureName: 'buildings/pine'
}

export const BIG_TENT: BuildingData = {
    pointsNeeded: 10,
    gain: 2,
    gainType: "community",
    name: 'big_tent',
    displayName: "Big Tent",
    textureName: 'buildings/big_tent',
}

export const HUT: BuildingData = {
    pointsNeeded: 0,
    name: 'hut',
    gain: 10,
    gainType: "money",
    textureName: 'buildings/hut',
    displayName: "Hut",
    needs: [["nature", 1], ["energy", 4]]
}

export const FIRE: BuildingData = {
    pointsNeeded: 0,
    gain: 2,
    gainType: "energy",
    name: 'fire',
    displayName: "Fire",
    textureName: 'buildings/fire'
}

export const FIELD: BuildingData = {
    pointsNeeded: 0,
    gain: 2,
    gainType: "food",
    name: 'field',
    displayName: "Crop",
    textureName: 'buildings/crop'
}

export const BUILDINGS: BuildingData[] = [
    TENT,
    PINE,
    FIELD,
    HUT,
    FIRE,
    BIG_TENT
]