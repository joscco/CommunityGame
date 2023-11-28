import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import Pointer = Phaser.Input.Pointer;
import {BuildingData} from "./BuildingData";
import {MainGameScene} from "../Game";
import {Building} from "./Building";
import Tween = Phaser.Tweens.Tween;

export class BuildingDictionarySlot {
    container: Container
    slot: Image
    icon: Image
    shown: boolean
    buildingData: BuildingData
    numberText: Text
    private scaleTween: Tween;

    constructor(scene: MainGameScene, x: number, y: number, resource: BuildingData) {
        this.buildingData = resource
        this.slot = scene.add.image(0, 0, 'inventory/slot')
        this.icon = scene.add.image(0, 20, resource.textureName)
        this.icon.setOrigin(0.5, 1)
        this.numberText = scene.add.text(20, 20, "0", {
            fontSize: 30,
            color: '000',
            align: "center"
        })
        this.container = scene.add.container(x, y, [this.slot, this.icon, this.numberText])
        this.container.setScale(0, 0)

        this.slot.setInteractive()
        this.slot.on("pointerdown", (pointer: Pointer) => {
            let building = new Building(scene, pointer.x, pointer.y, this.buildingData)
            scene.town.removeFromInventory(this.buildingData)
            scene.dragBuilding(building)
        })

        this.shown = false
    }


    blendOut() {
        this.tweenScaleTo(0, 300, false);
    }

    blendIn() {
        this.tweenScaleTo(1, 300, true)
    }

    private tweenScaleTo(scale: number, duration: number, shownAfter: boolean) {
        this.scaleTween?.remove()
        this.shown = shownAfter
        this.scaleTween = this.container.scene.tweens.add({
            targets: this.container,
            scaleX: scale,
            scaleY: scale,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: duration
        })
    }

    updateNumber(value: number) {
        this.numberText.text = value + ""
    }
}