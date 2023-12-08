import {Vector2} from "./MathUtils";

export class Dict<K, V> {
    private map = new Map<string, [K, V]>()

    constructor(public toIdString: (k: K) => string, entries?: Iterable<[K, V]>) {
        if (entries) {
            for (const [k, v] of entries) {
                this.set(k, v);
            }
        }
    }

    set(k: K, v: V) {
        this.map.set(this.toIdString(k), [k, v]);
        return this;
    }

    get(k: K): V | undefined {
        return this.map.get(this.toIdString(k))?.[1]
    }

    has(k: K): boolean {
        return this.map.has(this.toIdString(k))
    }

    deleteAllWithValue(v: V): void {
        this.map.forEach(([key, val]) => {
            if (val === v) {
                this.map.delete(this.toIdString(key))
            }
        })
    }

    delete(k: K): void {
        this.map.delete(this.toIdString(k))
    }

    [Symbol.iterator](): Iterator<[K, V]> {
        return this.map.values();
    }

    getEntries(lamda?: (k: K, v: V) => boolean): Array<[K, V]> {
        let entries: [K, V][] = []
        for (let [id, [key, value]] of this.map.entries()) {
            if (!lamda || lamda(key, value)) {
                entries.push([key, value])
            }
        }
        return entries
    }
}

export class Vector2Dict<V> extends Dict<Vector2, V> {
    constructor(entries?: Iterable<[Vector2, V]>) {
        super(v => "" + v.x + "," + v.y, entries);
    }
}

export class NeighborPairDict<V> extends Dict<[Vector2, Vector2], V> {
    constructor(entries?: Iterable<[[Vector2, Vector2], V]>) {
        super(([v, w]) => "" + v.x + "," + v.y + "->" + w.x + "," + w.y, entries);
    }
}