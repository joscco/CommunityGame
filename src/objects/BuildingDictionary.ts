import Container = Phaser.GameObjects.Container;
import {BuildingDictionarySlot} from "./BuildingDictionarySlot";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {BuildingData} from "./BuildingData";

export class BuildingDictionary {
    container: Container
    slots: BuildingDictionarySlot[] = []

    constructor(scene: MainGameScene, startData: BuildingData[]) {
        for (let i = 0; i < 9; i++) {
            let x = (i - 4) * 140
            this.slots.push(new BuildingDictionarySlot(scene, x, 0))
        }

        for (let i = 0; i < startData.length; i++) {
            this.slots[i].setBuildingData(startData[i])
        }

        this.container = scene.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 150, this.slots.flatMap(slot => [slot.slot, slot.container]))
        this.container.depth = GAME_HEIGHT
    }

    updateResources(resources: Map<BuildingData, boolean>) {
        this.slots.forEach(slot => {
            let buildingData = slot.buildingData
            let value = resources.get(buildingData) ?? false
            if (!slot.shown && value) {
                slot.updateNumber(buildingData.costInStars)
                slot.blendIn()
            }
        })
    }
}