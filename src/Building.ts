export type Building = {
    stars: number,
    chance: number,
    textureName: string,
    rows: number,
    columns: number,

    knowledgePlus?: number,
    healthPlus?: number,
    starPlus?: number,
    communityPlus?: number
}

export const HOUSE_1 : Building = {
    stars: 1,
    chance: 5,
    textureName: 'buildings/house_1',
    rows: 1,
    columns: 2,
    communityPlus: 3
}
export const HOUSE_2 : Building = {
    stars: 2,
    chance: 5,
    textureName: 'buildings/house_2',
    rows: 3,
    columns: 1,
    communityPlus: 7
}
export const TENT : Building = {
    stars: 1,
    chance: 10,
    textureName: 'buildings/tent',
    rows: 1,
    columns: 1,
    communityPlus: 1
}
export const PINE : Building = {
    stars: 1,
    chance: 10,
    textureName: 'buildings/pine',
    rows: 1,
    columns: 1,
    starPlus: 1
}

export const BUILDINGS: Building[] = [TENT, PINE, HOUSE_1, HOUSE_2]