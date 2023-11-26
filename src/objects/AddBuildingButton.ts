import {Scene} from "phaser";
import {BUILDINGS} from "./Building";
import {Town} from "./Town";

export class AddBuildingButton extends Phaser.GameObjects.Image {
    constructor(scene: Scene, x: number, y: number, town: Town) {
        super(scene, x, y, 'plus');
        scene.add.existing(this)

        let random = new Phaser.Math.RandomDataGenerator()

        this.setInteractive()
        this.on("pointerup", () => {
            let randomBuilding = random.pick(BUILDINGS)
            this.scaleUpThenDown()
            town.addResource(randomBuilding)
        })
    }

    private scaleUpThenDown() {
        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: 1.1,
                    duration: 200,
                    ease: Phaser.Math.Easing.Back.Out,
                    onStart: () => this.disableInteractive()
                },
                {
                    scale: 1,
                    duration: 200,
                    ease: Phaser.Math.Easing.Back.Out,
                    onComplete: () => this.setInteractive()
                }
            ]
        })
    }
}