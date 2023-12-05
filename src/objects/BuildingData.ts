export type BuildingData = {
    cost: number,
    gain: number,
    name: BuildingName,
    textureName: string,

    needs?: [BuildingNeed, number][]
    gains?: [BuildingNeed, number][]
}

export type BuildingNeed = 'nature' | 'knowledge' | 'health' | 'sex' | 'food' | 'fun' | 'community' | 'energy'

export type BuildingName = 'tent' | 'big_tent' | 'fire' | 'hut' | 'tree' | 'house' | 'tall_house' | 'court'| 'crop'

export const TENT: BuildingData = {
    cost: 1,
    gain: 0,
    name: 'tent',
    textureName: 'buildings/tent',
    gains: [["community", 1]]
}
export const PINE: BuildingData = {
    cost: 1,
    gain: 0,
    name: 'tree',
    textureName: 'buildings/pine',
    gains: [["nature", 1]]
}

export const BIG_TENT: BuildingData = {
    cost: 2,
    gain: 2,
    name: 'big_tent',
    textureName: 'buildings/big_tent',
    gains: [["community", 2]]
}

export const HUT: BuildingData = {
    cost: 222,
    name: 'hut',
    gain: 10,
    textureName: 'buildings/hut',
    needs: [["nature", 1], ["energy", 2]],
    gains: [["community", 2]]
}

export const FIRE: BuildingData = {
    cost: 1,
    gain: 1,
    name: 'fire',
    textureName: 'buildings/fire',
    gains: [["community", 3], ["energy", 2]]
}

export const CROP: BuildingData = {
    cost: 1,
    gain: 1,
    name: 'crop',
    textureName: 'buildings/crop',
    gains: [["food", 3]]
}

export const BUILDINGS: BuildingData[] = [
    TENT,
    PINE,
    CROP,
    HUT,
    FIRE,

]