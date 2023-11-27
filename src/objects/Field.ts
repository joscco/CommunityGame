import Image = Phaser.GameObjects.Image;
import {Scene} from "phaser";
import Tween = Phaser.Tweens.Tween;

export class Field extends Image {

    inner: Image
    innerShown: boolean
    scaleTween: Tween

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'field');
        scene.add.existing(this)

        this.inner = scene.add.image(x, y, 'field_inner')
        this.inner.scale = 0
    }

    blendInInner() {
        if (!this.innerShown) {
            this.innerShown = true
            this.tweenScaleInner(1, 200, Phaser.Math.Easing.Back.Out)
        }
    }

    blendOutInner() {
        if (this.innerShown) {
            this.innerShown = false
            this.tweenScaleInner(0, 200, Phaser.Math.Easing.Back.In)
        }
    }

    private tweenScaleInner(scale: number, duration: number, ease: (x: number) => number) {
        this.scaleTween?.remove()
        this.scaleTween = this.scene.tweens.add({
            targets: this.inner,
            scale: scale,
            duration: duration,
            ease: ease
        })
    }
}