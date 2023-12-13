import {BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import {getColorForNeed} from "./NeedIcon";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class Arrow extends Container {

    sprite: Image
    text: Text

    constructor(scene: MainGameScene, position: Vector2Like, rotation: number, offset: Vector2Like) {
        super(scene, position.x + offset.x, position.y + offset.y)
        scene.add.existing(this)

        this.depth = 20
        this.scale = 0

        this.sprite = this.scene.add.image(0, 0, 'arrow')
        this.sprite.setOrigin(0.5)
        // Only rotate sprite so that text isn't rotated
        this.sprite.rotation = rotation

        this.text = scene.add.text(0, 0, "0", {
            fontSize: 20,
            color: '#ffffff',
            align: "center",
            fontFamily: "Londrina"
        })
        this.text.setOrigin(0.5)

        this.add([this.sprite, this.text])
    }

    setText(amount: number, need: BuildingNeed) {
        this.sprite.tint = getColorForNeed(need)
        this.text.text = amount.toString()
    }

    tweenMoveTo(x: number, y: number) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out,
        })
    }

    blendIn() {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 200,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })
    }

    blendOut() {
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })
    }
}