import {Scene} from "phaser";
import {BUILDINGS} from "./BuildingData";
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
            town.addToInventory(randomBuilding)
        })
    }

    private scaleUpThenDown() {
        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: 0.95,
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