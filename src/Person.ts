import * as Phaser from 'phaser';
import {Scene} from 'phaser';
import {IEntity} from "./Interfaces/IEntity";
import {Town} from "./Town";
import {GAME_HEIGHT, GAME_WIDTH} from "./Game";

const BORDER_OFFSET = 75;

export class Person extends Phaser.GameObjects.Image implements IEntity {


    walking: boolean = false
    private walkTween: Phaser.Tweens.Tween;
    private wiggleTween: Phaser.Tweens.Tween;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'person');

        scene.add.existing(this)
        this.setOrigin(0.5, 1);
    }

    walkSomewhere() {
        if (!this.walking) {
            let randomNewX = Phaser.Math.Clamp(-150 + 300 * Math.random() + this.x, BORDER_OFFSET, GAME_WIDTH - BORDER_OFFSET);
            let randomNewY = Phaser.Math.Clamp(-150 + 300 * Math.random() + this.y, BORDER_OFFSET, GAME_HEIGHT - BORDER_OFFSET);
            let randomDelay = Math.random() * 10000;
            let distance = Phaser.Math.Distance.Between(this.x, this.y, randomNewX, randomNewY)
            this.move(randomNewX, randomNewY, distance * 20, randomDelay)
        }
    }

    update() {
        if (!this.walking) {
            this.walkSomewhere()
        }

        this.setDepth(this.y)
    }

    onClick(town: Town) {

    }

    move(x: number, y: number, duration: number, delay: number) {
        this.walking = true
        this.walkTween?.remove()
        this.walkTween = this.scene.tweens.add({
                targets: this,
                x: x,
                y: y,
                delay: delay,
                ease: Phaser.Math.Easing.Linear,
                duration: duration,
                onStart: () => {
                    if (x > this.x) {
                        this.flipX = false
                    } else if (x < this.x) {
                        this.flipX = true;
                    }
                    this.startWiggling()
                },
                onComplete: () => {
                    this.walking = false
                    this.stopWiggling()
                }
            }
        )
    }

    private startWiggling() {
        this.wiggleTween?.destroy()
        this.wiggleTween = this.scene.tweens.add({
            targets: this,
            // Wiggle in the direction you want to go
            angle: this.flipX ? -8 : 8,
            duration: 100,
            loop: -1,
            yoyo: true,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })
    }

    private stopWiggling() {
        this.wiggleTween?.destroy()
        this.wiggleTween = this.scene.tweens.add({
            targets: this,
            angle: 0,
            duration: 100,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })
    }
}