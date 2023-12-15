import {BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;

export function getColorForNeed(need: BuildingNeed): number {
    switch (need) {
        case "nature":
            return 0x285454
        case "food":
            return 0x9e4639
        case "energy":
            return 0xffa315
        case "points":
            return 0x000000
    }
    return 0xaa00aa
}

export function getFontColorForNeed(need: BuildingNeed): number {
    switch (need) {
        case "food":
            return 0x9e4639
        case "energy":
        case "points":
        case "nature":
            return 0xffffff
    }
    return 0xaa00aa
}

export class NeedIcon extends Container {

    isNeed: boolean
    need: BuildingNeed
    initalValue: number
    currentValue: number
    plate: Image
    text: Text

    constructor(scene: MainGameScene, x: number, y: number, isNeed: boolean, need: BuildingNeed, amount: number) {
        super(scene, x, y)
        scene.add.existing(this)

        this.plate = scene.add.image(0, 0, 'needRect')
        this.plate.tint = getColorForNeed(need)

        this.isNeed = isNeed
        this.need = need
        this.initalValue = amount
        this.currentValue = amount

        this.text = scene.add.text(0, 0, "0", {
            fontSize: 20,
            color: "#ffffff",
            align: "center",
            fontFamily: "Londrina"
        })
        this.text.setOrigin(0.5)

        this.changeNumber(amount)

        this.add([this.plate, this.text])

        this.scale = 0
        this.blendIn()
    }

    blendIn() {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out
        })
    }

    blendOut() {
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.In
        })
    }

    changeNumber(amount: number) {
        this.currentValue = amount

        if (amount != 0) {
            this.text.text = (this.isNeed ? "-" : "") + amount
        }

        if (this.currentValue <= 0) {
            this.blendOut()
        } else {
           this.blendIn()
        }
    }

    reset() {
        this.changeNumber(this.initalValue)
    }
}