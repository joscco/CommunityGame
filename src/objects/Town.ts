import Vector2Like = Phaser.Types.Math.Vector2Like;
import GameObject = Phaser.GameObjects.GameObject;
import Pointer = Phaser.Input.Pointer;
import {BuildingData, BUILDINGS} from "./BuildingData";
import {BuildingDictionary} from "./BuildingDictionary";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {Field, FIELD_HEIGHT, FIELD_WIDTH} from "./Field";
import {Building} from "./Building";
import {Vector2Dict} from "../general/Dict";

export class Town {

    scene: MainGameScene
    entities: Vector2Dict<GameObject> = new Vector2Dict()
    inventory: Map<BuildingData, number> = new Map([])
    resourceDictionary: BuildingDictionary
    fields: Map<Vector2Like, Field>

    private fieldAreaWidth: number;
    private fieldAreaHeight: number;
    private offsetFirstX: number;
    private offsetFirstY: number;
    private columns: number;
    private rows: number;

    constructor(scene: MainGameScene, rows: number, columns: number) {
        this.scene = scene
        this.resourceDictionary = new BuildingDictionary(scene, BUILDINGS)

        this.fields = this.initFields(rows, columns)

        this.scene.input.on('pointermove', (pointer: Pointer) => {
            this.dragBuildingToPointer(pointer);
        })

        this.scene.input.on('pointerup', (pointer: Pointer) => {
            this.releaseDraggedBuilding(pointer);
        })
    }

    private releaseDraggedBuilding(pointer: Phaser.Input.Pointer) {
        let draggedBuilding = this.scene.draggedBuilding
        if (this.scene.dragging && draggedBuilding) {
            let [rows, columns] = [draggedBuilding.buildingData.rows, draggedBuilding.buildingData.columns]
            let closestIndices = this.getClosestIndicesTo(rows, columns, pointer)

            if (closestIndices.length === rows * columns && this.areFree(closestIndices)) {
                this.setBuildingAt(closestIndices, draggedBuilding)
            } else {
                this.addToInventory(this.scene.draggedBuilding.buildingData)
                this.scene.draggedBuilding.blendOutThenDestroy();
            }
        }
        this.fields.forEach(field => field.blendOutInner())
        this.scene.dragging = false
    }

    private dragBuildingToPointer(pointer: Phaser.Input.Pointer) {
        let draggedBuilding = this.scene.draggedBuilding
        if (this.scene.dragging && draggedBuilding) {
            draggedBuilding.x = pointer.x
            draggedBuilding.y = pointer.y
            let buildingData = draggedBuilding.buildingData
            this.markFieldsClosestTo(buildingData.rows, buildingData.columns, pointer)
        }
    }

    private areFree(indices: Vector2Like[]): boolean {
        return indices.every(index => !this.entities.has(index))
    }

    removeBuilding(building: Building) {
        this.entities.deleteAllWithValue(building)
    }

    private static cartesian(first: number[], second: number[]): Vector2Like[] {
        return first.flatMap(a => second.map(b => {
            return {x: a, y: b}
        }))
    }

    markFieldsClosestTo(rows: number, columns: number, mousePosition: Vector2Like) {
        let indices = this.getClosestIndicesTo(rows, columns, mousePosition);

        this.fields.forEach(field => {
            if (indices.some(index => index.x === field.index.x && index.y === field.index.y)) {
                field.blendInInner(this.areFree([field.index]))
            } else {
                field.blendOutInner()
            }
        })
    }

    setBuildingAt(indices: Vector2Like[], building: Building) {
        let center = indices.map(index => [this.offsetFirstX + FIELD_WIDTH * index.x, this.offsetFirstY + FIELD_HEIGHT * index.y])
            .reduce((index, previous) => {
                return [previous[0] + index[0], previous[1] + index[1]]
            })
        let indexLength = indices.length
        indices.forEach(index => this.entities.set(index, building))
        let [x, y] = [center[0] / indexLength, center[1] / indexLength]
        building.moveTo(x, y)
    }

    addToInventory(buildingData: BuildingData) {
        let currentValue = this.inventory.get(buildingData) ?? 0
        this.inventory.set(buildingData, currentValue + 1)
        this.resourceDictionary.updateResources(this.inventory)
    }

    removeFromInventory(buildingData: BuildingData) {
        let currentValue = this.inventory.get(buildingData) ?? 1
        this.inventory.set(buildingData, currentValue - 1)
        this.resourceDictionary.updateResources(this.inventory)
    }

    private initFields(rows: number, columns: number): Map<Vector2Like, Field> {
        this.columns = columns
        this.rows = rows
        this.fieldAreaWidth = columns * FIELD_WIDTH
        this.fieldAreaHeight = rows * FIELD_HEIGHT
        this.offsetFirstX = (GAME_WIDTH - this.fieldAreaWidth) / 2 + FIELD_WIDTH / 2
        this.offsetFirstY = (GAME_HEIGHT - this.fieldAreaHeight) / 2 + FIELD_HEIGHT / 2

        let fields = new Map<Vector2Like, Field>();
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                let field = new Field(this.scene, x, y, this.offsetFirstX + FIELD_WIDTH * x, this.offsetFirstY + FIELD_HEIGHT * y)
                field.alpha = 0
                field.depth = 0
                fields.set({x: x, y: y}, field)
                this.scene.tweens.add({
                    targets: field,
                    alpha: 1,
                    delay: (Math.abs(x) + Math.abs(y)) * 50,
                    duration: 300,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                })
            }
        }
        return fields
    }

    private getClosestIndicesTo(rows: number, columns: number, mousePosition: Phaser.Types.Math.Vector2Like) {
        let indicesX = this.getClosestIndices(this.offsetFirstX, FIELD_WIDTH, this.columns, columns, mousePosition.x)
        let indicesY = this.getClosestIndices(this.offsetFirstY, FIELD_HEIGHT, this.rows, rows, mousePosition.y)

        return Town.cartesian(indicesX, indicesY)
    }

    private getClosestIndices(offset: number, expansion: number, maxValue: number, number: number, value: number): number[] {
        if (number % 2 === 0) {
            let closestIndex = Math.floor((value - offset) / expansion) + 1
            if (closestIndex < 0 || closestIndex >= maxValue) {
                return []
            }
            return [...Array(number).keys()].map(key => key - number / 2 + closestIndex)
        } else {
            let closestIndex = Math.floor((value - offset + expansion / 2) / expansion)
            if (closestIndex < 0 || closestIndex >= maxValue) {
                return []
            }
            return [...Array(number).keys()].map(key => key - (number - 1) / 2 + closestIndex)
        }
    }


}