import Pointer = Phaser.Input.Pointer;
import {BuildingData, BuildingNeed, BUILDINGS} from "./BuildingData";
import {BuildingDictionary} from "./BuildingDictionary";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {Field, FIELD_HEIGHT, FIELD_WIDTH} from "./Field";
import {Building} from "./Building";
import {NeighborPairDict, Vector2Dict} from "../general/Dict";
import {Arrow} from "./Arrow";
import {getDirectNeighborIndices, Vector2, vector2Equals} from "../general/MathUtils";
import Text = Phaser.GameObjects.Text;

const ARROW_POSITIONS = [
    {x: 65, y: 0},
    {x: 0, y: 65},
    {x: -65, y: 0},
    {x: 0, y: -65},
]

export class Town {

    level: number;
    money: number = 1;

    moneyText: Text

    scene: MainGameScene
    entities: Vector2Dict<Building> = new Vector2Dict()
    catalogue: Map<BuildingData, boolean> = new Map([])

    buildingDictionary: BuildingDictionary
    fields: Map<Vector2, Field>
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
            return getDirectNeighborIndices(index)
                .map((neighborIndex, i) => {
                    let position = this.getPositionForIndex(index)
                    let offset = ARROW_POSITIONS[i]
                    let rotation = Phaser.Math.Angle.Between(index.x, index.y, neighborIndex.x, neighborIndex.y)
                    return [
                        [index, neighborIndex],
                        new Arrow(this.scene, position, rotation, offset)
                    ] as [[Vector2, Vector2], Arrow]
                })
        }))

        this.moneyText = scene.add.text(GAME_WIDTH / 2, 30, this.money.toString(), {
            fontSize: 50,
            color: '#000000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.moneyText.setOrigin(0.5)
    }

    private getPositionForIndex(index: Phaser.Types.Math.Vector2Like): Vector2 {
        return {
            x: this.offsetFirstX + index.x * FIELD_WIDTH,
            y: this.offsetFirstY + index.y * FIELD_HEIGHT
        }
    }

    private releaseDraggedBuilding(pointer: Phaser.Input.Pointer) {
        let draggedBuilding = this.scene.draggedBuilding
        if (this.scene.dragging && draggedBuilding) {
            let closestIndex = this.getClosestIndexTo(pointer)

            if (closestIndex && this.isFree(closestIndex)) {
                this.setBuildingAt(closestIndex, draggedBuilding)
            } else {
                this.addToCatalogue(this.scene.draggedBuilding.buildingData)
                draggedBuilding.blendOutThenDestroy();
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
            this.markFieldClosestTo(pointer)
        }
    }

    private isFree(index: Vector2): boolean {
        return !this.entities.has(index)
    }

    private updateMoney(amount: number) {
        this.money = amount
        if (amount.toString() != this.moneyText.text) {
            this.scene.tweens.chain({
                targets: this.moneyText,
                tweens: [{
                    scale: 0,
                    duration: 100,
                    ease: Phaser.Math.Easing.Back.In,
                    onComplete: () => {
                        this.moneyText.text = amount.toString()
                    }
                }, {
                    scale: 1,
                    duration: 100,
                    ease: Phaser.Math.Easing.Back.Out,
                }]
            })
        }
    }

    private blendOutArrow(from: Vector2, to: Vector2) {
        this.arrows.get([from, to]).blendOut()
    }

    private blendInArrow(from: Vector2, to: Vector2, amount: number, need: BuildingNeed) {
        let arrow = this.arrows.get([from, to])
        arrow.setText(amount, need)
        arrow.blendIn()
    }

    private markFieldClosestTo(mousePosition: Vector2) {
        let index = this.getClosestIndexTo(mousePosition);

        this.fields.forEach(field => {
            if (index && vector2Equals(index, field.index)) {
                field.blendInInner(this.isFree(field.index))
            } else {
                field.blendOutInner()
            }
        })
    }

    removeBuildingFromField(building: Building) {
        this.entities.deleteAllWithValue(building)
        this.updateStatus(building);
    }

    setBuildingAt(index: Vector2, building: Building) {
        this.entities.set(index, building)
        let pos = this.getPositionForIndex(index)
        building.tweenMoveTo(index, pos.x, pos.y)

        this.rollNewBuildings()
        this.updateStatus();
    }

    addToCatalogue(buildingData: BuildingData) {
        this.catalogue.set(buildingData, true)
        this.buildingDictionary.updateResources(this.catalogue)
    }

    private initFields(columns: number, rows: number): Map<Vector2, Field> {
        this.columns = columns
        this.rows = rows
        this.fieldAreaWidth = columns * FIELD_WIDTH
        this.fieldAreaHeight = rows * FIELD_HEIGHT
        this.offsetFirstX = (GAME_WIDTH - this.fieldAreaWidth) / 2 + FIELD_WIDTH / 2
        this.offsetFirstY = (GAME_HEIGHT - this.fieldAreaHeight) / 2 + FIELD_HEIGHT / 2 - 50

        let fields = new Map<Vector2, Field>();
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                let field = new Field(this.scene, x, y, this.offsetFirstX + FIELD_WIDTH * x, this.offsetFirstY + FIELD_HEIGHT * y)
                field.alpha = 0
                field.depth = 0
                fields.set({x: x, y: y}, field)
                field.blendIn((Math.abs(x) + Math.abs(y)) * 50, 300)
            }
        }
        return fields
    }

    private getClosestIndexTo(mousePosition: Phaser.Types.Math.Vector2Like): Vector2 | undefined {
        let indexX = this.getClosestIndex(this.offsetFirstX, FIELD_WIDTH, this.columns, mousePosition.x)
        let indexY = this.getClosestIndex(this.offsetFirstY, FIELD_HEIGHT, this.rows, mousePosition.y)

        if (indexX && indexY) {
            return {x: indexX, y: indexY}
        }

        return undefined
    }

    private getClosestIndex(offset: number, expansion: number, maxValue: number, value: number): number | undefined {
        let closestIndex = Math.floor((value - offset + expansion / 2) / expansion)
        if (closestIndex < 0 || closestIndex >= maxValue) {
            return undefined
        }
        return closestIndex
    }

    private rollNewBuildings() {
        // change something
    }

    private updateStatus(building?: Building) {
        [...this.fields.keys()].forEach(index => {
            getDirectNeighborIndices(index)
                .forEach(neighborIndex => this.blendOutArrow(index, neighborIndex))
            this.entities.get(index)?.reset()
        })
        building?.reset()
        this.entities.getEntries().forEach(([index, building]) => {
            let neighbors = this.getNeighborBuildingsOfIndex(index)
            this.getSufficientSuppliers(building, neighbors)
        })

        let entitiesValue = this.entities.getEntries((index, building) => building.isMoney() && building.needsAreMet())
            .map(([index, building]) => building.buildingData.gain).reduce((a, b) => a + b, 0)

        this.updateMoney(Math.max(entitiesValue, 1))
    }

    private getSufficientSuppliers(building: Building, neighbors: Building[]): void {
        building.needs.map(needItem => {
            let needType = needItem.need
            let firstAmount = needItem.currentValue

            if (firstAmount > 0) {
                for (let neighbor of neighbors) {
                    let neededAmount = needItem.currentValue
                    if (neededAmount > 0) {
                        let possibleAmount = neighbor.getPossibleSupplyAmount(needType)
                        if (possibleAmount > 0) {
                            let realAmount = Math.min(neededAmount, possibleAmount)
                            neighbor.takeAway(needType, realAmount)
                            building.give(needType, realAmount)
                            this.blendInArrow(neighbor.index, building.index, realAmount, needType)
                        }
                    }
                }
            }
        })
    }

    private getNeighborBuildingsOfIndex(index: Vector2): Building[] {
        let neighborIndices = getDirectNeighborIndices(index)
        return neighborIndices.map(index => this.entities.get(index))
            .filter(neighbor => neighbor)
    }
}