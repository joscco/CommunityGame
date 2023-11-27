import Vector2Like = Phaser.Types.Math.Vector2Like;
import GameObject = Phaser.GameObjects.GameObject;
import Pointer = Phaser.Input.Pointer;
import {Scene} from "phaser";
import {BuildingData, BUILDINGS} from "./BuildingData";
import {IEntity} from "../Interfaces/IEntity";
import {BuildingDictionary} from "./BuildingDictionary";
import {MainGameScene} from "../Game";

export class Town {

    entities: Map<Vector2Like, GameObject> = new Map([])
    resources: Map<BuildingData, number> = new Map([])
    resourceDictionary: BuildingDictionary

    constructor(scene: MainGameScene) {
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

    addResource(resource: BuildingData) {
        let currentValue = this.resources.get(resource) ?? 0
        this.resources.set(resource, currentValue + 1)
        this.resourceDictionary.updateResources(this.resources)
    }
}