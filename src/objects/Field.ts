import Image = Phaser.GameObjects.Image;
import {Scene} from "phaser";
import Tween = Phaser.Tweens.Tween;
import Vector2Like = Phaser.Types.Math.Vector2Like;

export const FIELD_WIDTH = 100
export const FIELD_HEIGHT = 75

export class Field extends Image {

    inner: Image
    innerShown: boolean
    index: Vector2Like;
    private scaleTween: Tween

    constructor(scene: Scene, i: number, j: number, x: number, y: number) {
        super(scene, x, y, 'field');
        scene.add.existing(this)

        this.index = {x: i, y: j}

        this.inner = scene.add.image(x, y, 'field_inner')
        this.inner.scale = 0
    }

    blendInInner(free: boolean) {
        this.inner.setTexture(free ? 'field_inner' : 'field_inner_canceled')
        if (!this.innerShown) {
            this.innerShown = true
            this.tweenScaleInner(1, 200, Phaser.Math.Easing.Back.Out)
        }
    }

    blendOutInner() {
        if (this.innerShown) {
            this.innerShown = false
            this.tweenScaleInner(0, 100, Phaser.Math.Easing.Back.In)
        }
    }

    private tweenScaleInner(scale: number, duration: number, ease: (x: number) => number) {
        this.scaleTween?.remove()
        this.scaleTween = this.scene.tweens.add({
            targets: this.inner,
            scale: scale,
            alpha: scale,
            duration: duration,
            ease: ease
        })
    }
}