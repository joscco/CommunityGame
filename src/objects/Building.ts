import {BuildingData, BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import {NeedIcon} from "./NeedIcon";

export class Building extends Container {

    plate: Image
    icon: Image
    buildingData: BuildingData

    gainText: Text

    gainTexts: NeedIcon[]
    needsTexts: NeedIcon[]
    arrows: Image[]

    constructor(scene: MainGameScene, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y)
        scene.add.existing(this)

        this.plate = scene.add.image(0, 0, 'plate')
        this.icon = scene.add.image(0, 0, buildingData.textureName)

        this.gainText = scene.add.text(-30, 15, "0", {
            fontSize: 30,
            color: '000',
            align: "center",
            fontFamily: "Londrina"
        })

        this.gainTexts = (buildingData.gains ?? [])
            .map(([gain, amount], i) => new NeedIcon(scene, -35 + i * 35, 35, false, gain, amount))

        this.needsTexts = (buildingData.needs ?? [])
            .map(([need, amount], i) => new NeedIcon(scene, -35 + i * 35, -35, true, need, amount))



        this.add([this.plate, this.icon, this.gainText, ...this.needsTexts, ...this.gainTexts])

        this.buildingData = buildingData
        this.scale = 0
        this.depth = 0
        this.blendIn()

        // Show tear down button here instead
        this.plate.setInteractive()

        this.plate.on("pointerdown", () => {
            scene.dragBuilding(this)
            scene.town.removeBuilding(this)
        })
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

    tryToSupplyWith(neighbors: Building[]) {

    }
}