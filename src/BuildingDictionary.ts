import Container = Phaser.GameObjects.Container;
import {BuildingDictionarySlot} from "./BuildingDictionarySlot";
import {Scene} from "phaser";
import {GAME_HEIGHT, GAME_WIDTH} from "./Game";
import {Building} from "./Building";

export class BuildingDictionary extends Container {
    slots: BuildingDictionarySlot[] = []

    constructor(scene: Scene, resources: Building[]) {
        super(scene);

        let bottomCenterPoint = {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT
        }

        let maxNumberOfSlots = resources.length

        for (let i = 0; i < maxNumberOfSlots; i++) {
            let x = bottomCenterPoint.x + (i - maxNumberOfSlots/2) * 140
            let y = bottomCenterPoint.y - 100
            this.slots.push(new BuildingDictionarySlot(scene, x, y, resources[i]))
        }
    }

    updateResources(resources: Map<Building, number>) {
        this.slots.forEach(slot => {
            let value = resources.get(slot.resource) ?? 0
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