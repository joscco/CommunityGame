export type BuildingData = {
    costInStars: number,
    chance: number,
    textureName: string,
    rows: number,
    columns: number,

    starPlus?: number,
    knowledgePlus?: number,
    healthPlus?: number,
    sexPlus?: number,
    foodPlus?: number,
    funPlus?: number,
    communityPlus?: number,
    energyPlus?: number,
}

export const HOUSE_1: BuildingData = {
    costInStars: 1,
    chance: 5,
    textureName: 'buildings/house_1',
    rows: 1,
    columns: 1,
    communityPlus: 3
}
export const HOUSE_2: BuildingData = {
    costInStars: 2,
    chance: 5,
    textureName: 'buildings/house_2',
    rows: 2,
    columns: 1,
    communityPlus: 7
}

export const HOUSE_3: BuildingData = {
    costInStars: 2,
    chance: 5,
    textureName: 'buildings/house_3',
    rows: 3,
    columns: 1,
    communityPlus: 7
}

export const TENT: BuildingData = {
    costInStars: 1,
    chance: 10,
    textureName: 'buildings/tent',
    rows: 1,
    columns: 1,
    communityPlus: 1
}
export const PINE: BuildingData = {
    costInStars: 1,
    chance: 10,
    textureName: 'buildings/pine',
    rows: 1,
    columns: 1,
    starPlus: 1
}

export const BUILDINGS: BuildingData[] = [
    TENT,
    PINE,
    HOUSE_1,
    HOUSE_2,
    HOUSE_3
]