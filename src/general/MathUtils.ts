export type Vector2 = { x: number, y: number }

// Starting with above then going clockwise
export function vector2Neighbors(index: Vector2): Vector2[] {
    return [[0, -1], [1, 0], [0, 1], [-1, 0]]
        .map(summand => vector2Add(index, {x: summand[0], y: summand[1]}))
}

export function vector2Add(a: Vector2, b: Vector2): Vector2 {
    return {x: a.x + b.x, y: a.y + b.y}
}

export function vector2Equals(index: Vector2, field: Vector2): boolean {
    return index.x === field.x && index.y === field.y
}