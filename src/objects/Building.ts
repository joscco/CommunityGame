import {BuildingData, BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import {NeedIcon} from "./NeedIcon";
import {Vector2} from "./Town";

export class Building extends Container {

    index: Vector2
    plate: Image
    icon: Image
    buildingData: BuildingData

    gainText: Text

    supplies: NeedIcon[]
    needs: NeedIcon[]

    constructor(scene: MainGameScene, index: Vector2, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y)
        scene.add.existing(this)

        this.index = index
        this.plate = scene.add.image(0, 0, 'plate')
        this.icon = scene.add.image(0, 0, buildingData.textureName)

        this.gainText = scene.add.text(-30, 15, "0", {
            fontSize: 30,
            color: '000',
            align: "center",
            fontFamily: "Londrina"
        })

        this.supplies = (buildingData.gains ?? [])
            .map(([gain, amount], i) => new NeedIcon(scene, -35 + i * 35, 35, false, gain, amount))

        this.needs = (buildingData.needs ?? [])
            .map(([need, amount], i) => new NeedIcon(scene, -35 + i * 35, -35, true, need, amount))

        this.add([this.plate, this.icon, this.gainText, ...this.needs, ...this.supplies])

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

    tweenMoveTo(index: Vector2, x: number, y: number) {
        this.index = index
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

    takeAway(need: BuildingNeed, amount: number) {
        let icon = this.supplies.find(icon => icon.need === need)
        if (icon) {
            icon.changeNumber(icon.currentValue - amount)
        }
    }

    give(need: BuildingNeed, amount: number) {
        let icon = this.needs.find(icon => icon.need === need)
        if (icon) {
            icon.changeNumber(icon.currentValue - amount)
        }
    }

    getPossibleSupplyAmount(needType: BuildingNeed): number {
        return this.supplies.find(icon => icon.need === needType)?.currentValue
    }

    reset() {
        this.supplies.forEach(supply => supply.reset())
        this.needs.forEach(need => need.reset())
    }
}