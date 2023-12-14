import Container = Phaser.GameObjects.Container;
import {GAME_WIDTH, MainGameScene} from "../Game";
import Text = Phaser.GameObjects.Text;

export class PointDisplay extends Container {

    points: number;
    pointsPreText: Text
    pointsText: Text

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this)

        this.pointsPreText = scene.add.text(0, 0, "Points: ", {
            fontSize: 25,
            color: '#000000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.pointsPreText.setOrigin(0.5)

        this.pointsText = scene.add.text(0, 40, "", {
            fontSize: 50,
            color: '#000000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.pointsText.setOrigin(0.5)

        this.add([this.pointsPreText, this.pointsText])
    }

    updatePoints(amount: number) {
        if (amount != this.points) {
            this.points = amount
            this.scene.tweens.chain({
                targets: this.pointsText,
                tweens: [{
                    scale: 0,
                    duration: 100,
                    ease: Phaser.Math.Easing.Back.In,
                    onComplete: () => {
                        this.pointsText.text = amount.toString()
                    }
                }, {
                    scale: 1,
                    duration: 100,
                    ease: Phaser.Math.Easing.Back.Out,
                }]
            })
        }
    }

}