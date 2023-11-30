export type BuildingData = {
    costInStars: number,
    name: BuildingName,
    recipe?: BuildingName[],
    textureName: string,
    rows: number,
    columns: number,

    naturePlus?: number,
    knowledgePlus?: number,
    healthPlus?: number,
    sexPlus?: number,
    foodPlus?: number,
    funPlus?: number,
    communityPlus?: number,
    energyPlus?: number,
}

export type BuildingName = 'tent' | 'big_tent' | 'fire' | 'hut' | 'tree' | 'house' | 'tall_house' | 'court'

export const TENT: BuildingData = {
    costInStars: 1,
    name: 'tent',
    textureName: 'buildings/tent',
    rows: 1,
    columns: 1,
    communityPlus: 1
}
export const PINE: BuildingData = {
    costInStars: 1,
    name: 'tree',
    textureName: 'buildings/pine',
    rows: 1,
    columns: 1,
    naturePlus: 1
}

export const BIG_TENT: BuildingData = {
    costInStars: 2,
    name: 'big_tent',
    recipe: ['tent', 'tent'],
    textureName: 'buildings/big_tent',
    rows: 1,
    columns: 1,
    communityPlus: 2
}

export const HUT: BuildingData = {
    costInStars: 3,
    name: 'hut',
    recipe: ['fire', 'tent'],
    textureName: 'buildings/hut',
    rows: 1,
    columns: 1,
    naturePlus: 1
}

export const FIRE: BuildingData = {
    costInStars: 1,
    name: 'fire',
    recipe: ['tree', 'tent'],
    textureName: 'buildings/fire',
    rows: 1,
    columns: 1,
    communityPlus: 1
}

export const HOUSE: BuildingData = {
    costInStars: 4,
    name: 'house',
    recipe: ['hut', 'hut'],
    textureName: 'buildings/house',
    rows: 2,
    columns: 1,
    communityPlus: 7
}

export const LARGE_HOUSE: BuildingData = {
    costInStars: 5,
    name: 'tall_house',
    recipe: ['house', 'house'],
    textureName: 'buildings/tall_house',
    rows: 3,
    columns: 1,
    communityPlus: 7
}

export const COURT: BuildingData = {
    costInStars: 5,
    name: 'court',
    recipe: ['fire', 'big_tent'],
    textureName: 'buildings/court',
    rows: 2,
    columns: 2,
    communityPlus: 10
}

export const BUILDINGS: BuildingData[] = [
    TENT,
    PINE,
    BIG_TENT,
    HUT,
    FIRE,
    HOUSE,
    LARGE_HOUSE,
    COURT
]