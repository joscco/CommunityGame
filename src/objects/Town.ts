import Vector2Like = Phaser.Types.Math.Vector2Like;
import Pointer = Phaser.Input.Pointer;
import Image = Phaser.GameObjects.Image;
import {BuildingData, BuildingNeed, BUILDINGS} from "./BuildingData";
import {BuildingDictionary} from "./BuildingDictionary";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {Field, FIELD_HEIGHT, FIELD_WIDTH} from "./Field";
import {Building} from "./Building";
import {NeighborPairDict, Vector2Dict} from "../general/Dict";
import {Arrow} from "./Arrow";

const ARROW_POSITIONS = [
    {x: 65, y: -25},
    {x: 25, y: 65},
    {x: -65, y: 25},
    {x: -25, y: -65},
]

export class Town {

    level: number;
    money: number;

    scene: MainGameScene
    entities: Vector2Dict<Building> = new Vector2Dict()
    catalogue: Map<BuildingData, boolean> = new Map([])
    buildingDictionary: BuildingDictionary
    fields: Map<Vector2Like, Field>
    arrows: NeighborPairDict<Arrow>

    private fieldAreaWidth: number;
    private fieldAreaHeight: number;
    private offsetFirstX: number;
    private offsetFirstY: number;
    private columns: number;
    private rows: number;

    constructor(scene: MainGameScene, columns: number, rows: number) {
        this.scene = scene
        this.buildingDictionary = new BuildingDictionary(scene, BUILDINGS)

        this.fields = this.initFields(columns, rows)

        this.scene.input.on('pointermove', (pointer: Pointer) => {
            this.dragBuildingToPointer(pointer);
        })

        this.scene.input.on('pointerup', (pointer: Pointer) => {
            this.releaseDraggedBuilding(pointer);
        })

        this.arrows = new NeighborPairDict([...this.fields.keys()].flatMap(index => {
            return this.getNeighborIndicesOf(index)
                .map((neighborIndex, i) => {
                    let position = this.getPositionForIndex(index)
                    let offset = ARROW_POSITIONS[i]
                    let rotation = Phaser.Math.Angle.Between(index.x, index.y, neighborIndex.x, neighborIndex.y)
                    return [[index, neighborIndex], new Arrow(this.scene, position, rotation, offset)] as [[Vector2Like, Vector2Like], Arrow]
                })
        }))
    }

    private getPositionForIndex(index: Vector2Like): Vector2Like {
        return {
            x: this.offsetFirstX + index.x * FIELD_WIDTH,
            y: this.offsetFirstY + index.y * FIELD_HEIGHT
        }
    }

    private releaseDraggedBuilding(pointer: Phaser.Input.Pointer) {
        let draggedBuilding = this.scene.draggedBuilding
        if (this.scene.dragging && draggedBuilding) {
            let closestIndex = this.getClosestIndexTo(1, 1, pointer)

            if (closestIndex && this.isFree(closestIndex)) {
                this.setBuildingAt(closestIndex, draggedBuilding)
            } else {
                this.addToCatalogue(this.scene.draggedBuilding.buildingData)
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
            this.markFieldsClosestTo(1, 1, pointer)
        }
    }

    private isFree(index: Vector2Like): boolean {
        return !this.entities.has(index)
    }

    private static cartesian(first: number[], second: number[]): Vector2Like[] {
        return first.flatMap(a => second.map(b => {
            return {x: a, y: b}
        }))
    }

    private blendInArrow(from: Vector2Like, to: Vector2Like, amount: number, need: BuildingNeed) {
        let arrow = this.arrows.get([from, to])
        arrow.setText(amount, need)
        this.scene.tweens.add({
            targets: arrow,
            scale: 1,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out
        })
    }

    private markFieldsClosestTo(rows: number, columns: number, mousePosition: Vector2Like) {
        let index = this.getClosestIndexTo(rows, columns, mousePosition);

        this.fields.forEach(field => {
            if (index && index.x === field.index.x && index.y === field.index.y) {
                field.blendInInner(this.isFree(field.index))
            } else {
                field.blendOutInner()
            }
        })
    }

    removeBuilding(building: Building) {
        this.entities.deleteAllWithValue(building)
        this.checkStatus();
    }

    setBuildingAt(index: Vector2Like, building: Building) {
        this.entities.set(index, building)
        let pos = this.getPositionForIndex(index)
        building.tweenMoveTo(pos.x, pos.y)

        this.rollNewBuildings()
        this.checkStatus();
    }

    addToCatalogue(buildingData: BuildingData) {
        this.catalogue.set(buildingData, true)
        this.buildingDictionary.updateResources(this.catalogue)
    }

    private initFields(columns: number, rows: number): Map<Vector2Like, Field> {
        this.columns = columns
        this.rows = rows
        this.fieldAreaWidth = columns * FIELD_WIDTH
        this.fieldAreaHeight = rows * FIELD_HEIGHT
        this.offsetFirstX = (GAME_WIDTH - this.fieldAreaWidth) / 2 + FIELD_WIDTH / 2
        this.offsetFirstY = (GAME_HEIGHT - this.fieldAreaHeight) / 2 + FIELD_HEIGHT / 2 - 130

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

    private getClosestIndexTo(rows: number, columns: number, mousePosition: Phaser.Types.Math.Vector2Like) : Vector2Like{
        let indicesX = this.getClosestIndices(this.offsetFirstX, FIELD_WIDTH, this.columns, columns, mousePosition.x)
        let indicesY = this.getClosestIndices(this.offsetFirstY, FIELD_HEIGHT, this.rows, rows, mousePosition.y)

        return {x: indicesX[0], y: indicesY[0]}
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

    private rollNewBuildings() {
        // change something
    }

    private checkStatus() {
        this.entities.getEntries().forEach(([index, building]) => {
            let neighbors = this.getNeighborIndicesOf(index)
            // building.tryToSupplyWith(neighbors)
            neighbors.forEach(neighborIndex => {
                if (this.entities.has(neighborIndex)) {
                    this.blendInArrow(index, neighborIndex, 0, 'energy')
                }
            })
        })
    }

    private getNeighborIndicesOf(index: Vector2Like): Vector2Like[] {
        return [
            {x: index.x + 1, y: index.y},
            {x: index.x, y: index.y + 1},
            {x: index.x - 1, y: index.y},
            {x: index.x, y: index.y - 1},
        ]
    }

    private getNeighborsOfIndex(index: Phaser.Types.Math.Vector2Like): Building[] {
        // Adapt this to buildings that take up more than one field!
        let neighborIndices = this.getNeighborIndicesOf(index)
        return neighborIndices.map(index => this.entities.get(index))
            .filter(neighbor => neighbor)
    }

    private average(pos: Phaser.Types.Math.Vector2Like, neighborPos: Phaser.Types.Math.Vector2Like) {
        return {x: (pos.x + neighborPos.x) / 2, y: (pos.y + neighborPos.y) / 2}
    }
}