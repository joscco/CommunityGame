export type BuildingData = {
    cost: number,

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
    cost: 1,
    gain: 1,
    gainType: "community",
    name: 'tent',
    textureName: 'buildings/tent',
}
export const PINE: BuildingData = {
    cost: 1,
    gain: 1,
    gainType: "nature",
    name: 'tree',
    textureName: 'buildings/pine'
}

export const BIG_TENT: BuildingData = {
    cost: 2,
    gain: 2,
    gainType: "community",
    name: 'big_tent',
    textureName: 'buildings/big_tent',
}

export const HUT: BuildingData = {
    cost: 10,
    name: 'hut',
    gain: 10,
    gainType: "money",
    textureName: 'buildings/hut',
    needs: [["nature", 1], ["energy", 4]]
}

export const FIRE: BuildingData = {
    cost: 1,
    gain: 2,
    gainType: "energy",
    name: 'fire',
    textureName: 'buildings/fire'
}

export const FIELD: BuildingData = {
    cost: 1,
    gain: 2,
    gainType: "food",
    name: 'field',
    textureName: 'buildings/crop'
}

export const BUILDINGS: BuildingData[] = [
    TENT,
    PINE,
    FIELD,
    HUT,
    FIRE,

]