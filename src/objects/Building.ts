import {BuildingData} from "./BuildingData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;

export class Building extends Image {

    buildingData: BuildingData

    constructor(scene: MainGameScene, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y, buildingData.textureName)
        scene.add.existing(this)
        this.buildingData = buildingData
        this.scale = 0
        this.blendIn()

        // Show tear down button here instead
        //this.setInteractive()

        // this.on("pointerdown", () => {
        //     scene.dragBuilding(this)
        //     scene.town.removeBuilding(this)
        // })
    }

    moveTo(x: number, y: number) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out,
            onUpdate: () => this.depth = this.y + this.height/2
        })
    }

    blendIn() {
        this.scene.tweens.add({
            targets: this,
            scale:1,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out
        })
    }

    blendOutThenDestroy() {
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.In,
            onComplete: () => this.destroy()
        })
    }

    getName() {
        return this.buildingData.name
    }
}