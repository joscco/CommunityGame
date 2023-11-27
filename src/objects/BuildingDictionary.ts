import Container = Phaser.GameObjects.Container;
import {BuildingDictionarySlot} from "./BuildingDictionarySlot";
import {Scene} from "phaser";
import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {BuildingData} from "./BuildingData";

export class BuildingDictionary {
    container: Container
    slots: BuildingDictionarySlot[] = []

    constructor(scene: MainGameScene, resources: BuildingData[]) {
        let maxNumberOfSlots = resources.length

        for (let i = 0; i < maxNumberOfSlots; i++) {
            let x = (i - maxNumberOfSlots / 2) * 140
            this.slots.push(new BuildingDictionarySlot(scene, x, 0, resources[i]))
        }

        this.container = scene.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 100, this.slots.map(slot => slot.container))
        this.container.depth = GAME_HEIGHT
    }

    updateResources(resources: Map<BuildingData, number>) {
        this.slots.forEach(slot => {
            let value = resources.get(slot.BuildingData) ?? 0
            if (slot.shown) {
                if (value <= 0) {
                    slot.blendOut()
                } else {
                    slot.updateNumber(value)
                }
            } else if (!slot.shown && value > 0) {
                slot.updateNumber(value)
                slot.blendIn()
            }
        })
    }
}