import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import GameObject = Phaser.GameObjects.GameObject;
import {Scene} from "phaser";
import {Building, BUILDINGS} from "./Building";
import {IEntity} from "./Interfaces/IEntity";
import {BuildingDictionary} from "./BuildingDictionary";
import Pointer = Phaser.Input.Pointer;

export class Town {

    entities: Map<Vector2Like, GameObject> = new Map([])
    resources: Map<Building, number> = new Map([])
    resourceDictionary: BuildingDictionary

    constructor(scene: Scene) {
        this.resourceDictionary = new BuildingDictionary(scene, BUILDINGS)
    }

    isFree(x: number, y: number): boolean {
        return this.entities.has({x: x, y: y})
    }

    addEntity(entity: GameObject & IEntity): void {
        this.entities.set({x: entity.x, y: entity.y}, entity)

        entity.on("pointerup", (pointer: Pointer) => {
            entity.onClick(this)
        })
    }

    removeAtIndex(index: Vector2Like): void {
        if (this.entities.has(index)) {
            this.entities.delete(index)
        }
    }

    addResource(resource: Building) {
        let currentValue = this.resources.get(resource) ?? 0
        this.resources.set(resource, currentValue + 1)
        this.resourceDictionary.updateResources(this.resources)
    }
}