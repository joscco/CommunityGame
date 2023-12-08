export type Vector2 = { x: number, y: number }

export function getDirectNeighborIndices(index: Vector2): Vector2[] {
    return [
        {x: index.x + 1, y: index.y},
        {x: index.x, y: index.y + 1},
        {x: index.x - 1, y: index.y},
        {x: index.x, y: index.y - 1},
    ]
}

export function vector2Equals(index: Vector2, field: Vector2): boolean {
    return index.x === field.x && index.y === field.y
}