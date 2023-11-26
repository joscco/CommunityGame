import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import {Scene} from "phaser";
import {Building} from "./Building";
import Text = Phaser.GameObjects.Text;
import Graphics = Phaser.GameObjects.Graphics;

export class BuildingDictionarySlot extends Container {
    slot: Image
    icon: Image
    shown: boolean
    resource: Building
    numberTextBack: Graphics
    numberText: Text

    constructor(scene: Scene, x: number, y: number, resource: Building) {
        super(scene, x, y);
        this.scene.add.existing(this)

        this.resource = resource
        this.slot = scene.add.image(0, 0, 'inventory/slot')
        this.icon = scene.add.image(0, 20, resource.textureName)
        this.icon.setOrigin(0.5, 1)
        this.numberText = scene.add.text(20, 20, "0", {
            fontSize: 40,
            color: '000',
            align: "center"
        })
        this.add([this.slot, this.icon, this.numberText])

        this.setScale(0, 0)
        this.shown = false
    }


    blendOut() {
        this.tweenScaleTo(0, 300, false);
    }

    blendIn() {
        this.tweenScaleTo(1, 300, true)
    }

    private tweenScaleTo(scale: number, duration: number, shownAfter: boolean) {
        this.scene.tweens.add({
            targets: this,
            scaleX: scale,
            scaleY: scale,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: duration,
            onComplete: () => {
                this.shown = shownAfter
            }
        })
    }

    updateNumber(value: number) {
        this.numberText.text = value + ""
    }
}