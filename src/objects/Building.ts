import {BuildingData, BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import {getColorForNeed, NeedIcon} from "./NeedIcon";
import {Vector2} from "../general/MathUtils";

export class Building extends Container {

    index: Vector2
    icon: Image
    buildingData: BuildingData

    gainText: Text
    currentGainValue: number

    needs: NeedIcon[]

    constructor(scene: MainGameScene, index: Vector2, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y)
        scene.add.existing(this)

        this.buildingData = buildingData
        this.index = index
        this.icon = scene.add.image(0, 0, buildingData.textureName)

        this.gainText = scene.add.text(0, 0, "0", {
            fontSize: 50,
            color: "#" + getColorForNeed(buildingData.gainType).toString(16),
            align: "center",
            fontFamily: "Londrina"
        })
        this.gainText.setOrigin(0.5)

        this.needs = (buildingData.needs ?? [])
            .map(([need, amount], i) => new NeedIcon(scene, -40 + i * 80, -40, true, need, amount))

        this.setGainValue(buildingData.gain)

        this.add([this.icon, this.gainText, ...this.needs])

        this.scale = 0
        this.depth = 0
        this.blendIn()

        // Show tear down button here instead
        this.icon.setInteractive()

        this.icon.on("pointerdown", () => {
            scene.dragBuilding(this)
            scene.town.removeBuildingFromField(this)
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
        console.log("Blend out")
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.In,
            onComplete: () => {
                this.destroy()
            }
        })
    }

    getName() {
        return this.buildingData.name
    }

    takeAway(need: BuildingNeed, amount: number) {
        if (this.buildingData.gainType === need) {

            this.setGainValue(this.currentGainValue - amount)
        }
    }

    give(need: BuildingNeed, amount: number) {
        let icon = this.needs.find(icon => icon.need === need)
        if (icon) {
            icon.changeNumber(icon.currentValue - amount)
        }

        this.setGainValue(this.currentGainValue)
    }

    getPossibleSupplyAmount(needType: BuildingNeed): number {
        return this.buildingData.gainType === needType ? this.currentGainValue : 0
    }

    reset() {
        this.setGainValue(this.buildingData.gain)
        this.needs.forEach(need => need.reset())
    }

    needsAreMet() {
        return this.needs.every(need => need.currentValue <= 0);
    }

    isMoney() {
        return this.buildingData.gainType === "money"
    }

    private setGainValue(newVal: number) {
        this.currentGainValue = newVal
        this.gainText.text = this.currentGainValue.toString()
        this.gainText.alpha = this.needsAreMet() ? 1 : 0.5
        this.gainText.scale = this.currentGainValue > 0 ? 1 : 0
    }
}