import Pointer = Phaser.Input.Pointer;
import {BuildingData, BuildingNeed, BUILDINGS} from "./BuildingData";
import {BuildingShop} from "./BuildingShop";
import {GAME_WIDTH, MainGameScene} from "../Game";
import {Building} from "./Building";
import {NeighborPairDict, Vector2Dict} from "../general/Dict";
import {Arrow} from "./Arrow";
import {Vector2, vector2Equals, vector2Neighbors} from "../general/MathUtils";
import {FieldManager} from "./FieldManager";
import {PointDisplay} from "./PointDisplay";
import {DistributionCalculator, TownBuilding} from "./DistributionCalculator";

const ARROW_POSITIONS = [
    // Up
    {x: 0, y: -65},
    // Right
    {x: 65, y: 0},
    // Bottom
    {x: 0, y: 65},
    // Left
    {x: -65, y: 0},
]

export class Town {

    scene: MainGameScene

    pointDisplay: PointDisplay
    entities: Vector2Dict<Building> = new Vector2Dict()

    buildingShop: BuildingShop
    fieldManager: FieldManager
    arrows: NeighborPairDict<Arrow>
    points: number

    constructor(scene: MainGameScene, columns: number, rows: number) {
        this.scene = scene

        this.pointDisplay = new PointDisplay(scene, GAME_WIDTH / 2, 75)
        this.buildingShop = new BuildingShop(scene, 5)

        this.fieldManager = new FieldManager(scene, columns, rows)

        this.scene.input.on('pointermove', (pointer: Pointer) => {
            this.dragBuildingToPointer(pointer);
        })

        this.scene.input.on('pointerup', (pointer: Pointer) => {
            this.releaseDraggedBuilding(pointer);
        })

        this.arrows = new NeighborPairDict(this.fieldManager.getFieldKeys().flatMap(index => {
            return vector2Neighbors(index)
                .map((neighborIndex, i) => {
                    let position = this.fieldManager.getPositionForIndex(index)
                    let offset = ARROW_POSITIONS[i]
                    let rotation = Phaser.Math.Angle.Between(index.x, index.y, neighborIndex.x, neighborIndex.y)
                    return [
                        [index, neighborIndex],
                        new Arrow(this.scene, position, rotation, offset)
                    ] as [[Vector2, Vector2], Arrow]
                })
        }))

        this.points = 0
        this.pointDisplay.updatePoints(this.points)
    }

    removeBuildingFromField(building: Building) {
        this.entities.deleteAllWithValue(building)
        this.updateStatus(building);
    }

    setBuildingAt(index: Vector2, building: Building) {
        let isNewBuilding = building.index == undefined
        this.entities.set(index, building)
        let pos = this.fieldManager.getPositionForIndex(index)
        building.depth = 0
        building.tweenMoveTo(index, pos.x, pos.y)

        this.updateStatus();

        // Reroll AFTER updating status
        if (isNewBuilding) {
            this.rollNewBuildings()
        }
    }

    private isFreeField(index: Vector2): boolean {
        return !this.entities.has(index)
    }

    private releaseDraggedBuilding(pointer: Phaser.Input.Pointer) {
        let draggedBuilding = this.scene.draggedBuilding
        if (this.scene.dragging && draggedBuilding) {
            let closestIndex = this.fieldManager.getClosestFieldIndexTo(pointer)

            if (closestIndex && this.isFreeField(closestIndex)) {
                this.setBuildingAt(closestIndex, draggedBuilding)
            } else {
                draggedBuilding.blendOutThenDestroy();
            }
        }
        this.fieldManager.forEachField(field => field.blendOutInner())
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

    private markFieldClosestTo(mousePosition: Vector2): void {
        let index = this.fieldManager.getClosestFieldIndexTo(mousePosition);

        this.fieldManager.forEachField(field => {
            if (index && vector2Equals(index, field.index)) {
                field.blendInInner(this.isFreeField(field.index))
            } else {
                field.blendOutInner()
            }
        })
    }

    private blendOutArrow(from: Vector2, to: Vector2) {
        let arrow = this.arrows.get([from, to])
        arrow.blendOut()
    }

    private blendInArrow(from: Vector2, to: Vector2, amount: number, need: BuildingNeed) {
        let arrow = this.arrows.get([from, to])
        arrow.setText(amount, need)
        arrow.blendIn()
    }

    public rollNewBuildings() {
        let Random = new Phaser.Math.RandomDataGenerator()
        let buildingsToChooseFrom = BUILDINGS.filter(building => building.pointsNeeded <= this.points)
        let buildingsForSlots = Random.shuffle(buildingsToChooseFrom)
            .filter((_, i) => i < this.buildingShop.getNumberOfSlots())
        this.buildingShop.updateBuildingsToBuy(buildingsForSlots)
    }

    private updateStatus(building?: Building) {
        this.blendOutAllArrows();

        building?.reset()

        // Find best distribution
        let newDistribution = DistributionCalculator.findOptimalDistribution(this.getTownState())

        for (let producer of newDistribution.values()) {
            let building = this.entities.get(producer.index)
            building.updateSupply(producer.supplyLeft)

            for (let need of producer.needs) {
                // Usually there's only one supplier
                building.updateNeed(need.type, need.left)

                for (let supplier of need.suppliers ?? []) {
                    if (supplier.supply > 0) {
                        this.blendInArrow(supplier.from, producer.index, supplier.supply, need.type)
                    }
                }
            }
        }

        let entitiesValue = this.entities.getEntries((index, building) => building.isMoney() && building.needsAreMet())
            .map(([index, building]) => building.buildingData.gain)
            .reduce((a, b) => a + b, 0)

        this.points = Math.max(entitiesValue, 0)
        this.pointDisplay.updatePoints(this.points)
    }

    private getTownState() {
        return new Map<number, TownBuilding>(
            this.entities.getEntries()
                .map(([index, building], i) => {
                    return [i, {
                        index: index,
                        iterationIndex: i,
                        supply: building.buildingData.gain,
                        supplyLeft: building.buildingData.gain,
                        supplyType: building.buildingData.gainType,
                        needs: (building.buildingData.needs ?? [])
                            .map(([need, num]) => {
                                return {
                                    type: need,
                                    left: num
                                }
                            })
                    }]
                })
        );
    }

    private blendOutAllArrows() {
        this.fieldManager.forEachField((field, index) => {
            vector2Neighbors(index)
                .forEach(neighborIndex => this.blendOutArrow(index, neighborIndex))
            this.entities.get(index)?.reset()
        })
    }
}