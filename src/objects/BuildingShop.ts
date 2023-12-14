import Container = Phaser.GameObjects.Container;
import {BuildingDictionarySlot} from "./BuildingDictionarySlot";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {BuildingData} from "./BuildingData";
import List = Phaser.Structs.List;

export class BuildingShop {
    container: Container
    slots: BuildingDictionarySlot[] = []

    constructor(scene: MainGameScene, numberOfSlots: number) {
        for (let i = 0; i < numberOfSlots; i++) {
            let x = (i - Math.floor(numberOfSlots / 2)) * 140
            this.slots.push(new BuildingDictionarySlot(scene, x, 0))
        }

        this.container = scene.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 130, this.slots.flatMap(slot => [slot.container]))
        this.container.depth = GAME_HEIGHT
    }

    getNumberOfSlots(): number {
        return this.slots.length
    }

    updateBuildingsToBuy(resources: BuildingData[]) {
        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i].setBuildingData(resources[i], i * 75)
        }

    }
}