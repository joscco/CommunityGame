import {BuildingData, BuildingNeed} from "./BuildingData";
import {MainGameScene} from "../Game";
import {getColorForNeed, getFontColorForNeed, NeedIcon} from "./NeedIcon";
import {Vector2} from "../general/MathUtils";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import Graphics = Phaser.GameObjects.Graphics;

export class Building extends Container {

    index: Vector2
    icon: Image
    buildingData: BuildingData

    gainText: Text
    gainBackground: Graphics
    currentGainValue: number
    needs: NeedIcon[]

    constructor(scene: MainGameScene, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y)
        scene.add.existing(this)

        this.buildingData = buildingData
        this.icon = scene.add.image(0, 0, buildingData.textureName)

        this.gainBackground = new Graphics(scene)
        this.gainBackground.fillStyle(getColorForNeed(buildingData.gainType))
        this.gainBackground.fillCircle(0, 0, 25)
        this.gainBackground.setPosition(50, -50)
        this.gainBackground.setScale(0)

        this.gainText = scene.add.text(50, -50, "0", {
            fontSize: 20,
            color: "#" + getFontColorForNeed(buildingData.gainType).toString(16),
            align: "center",
            fontFamily: "Londrina"
        })
        this.gainText.setOrigin(0.5)
        this.gainText.setScale(0)

        this.needs = (buildingData.needs ?? [])
            .map(([need, amount], i) => new NeedIcon(scene, -40 + i * 80, 40, true, need, amount))

        this.setGainValue(buildingData.gain)

        this.add([this.icon, this.gainBackground, this.gainText, ...this.needs])

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
        this.depth = index.y * 100 - index.x
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
            onComplete: () => {
                this.destroy()
            }
        })
    }

    getName() {
        return this.buildingData.name
    }

    updateSupply(amount: number) {
            this.setGainValue(amount)
    }

    updateNeed(need: BuildingNeed, amount: number) {
        let icon = this.needs.find(icon => icon.need === need)
        if (icon) {
            icon.changeNumber(amount)
        }

        // This is not very clear
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
        return this.buildingData.gainType === "points"
    }

    private setGainValue(newVal: number) {
        this.currentGainValue = newVal

        if (this.currentGainValue > 0) {
            this.gainText.text = this.currentGainValue.toString()
        }

        let newAlpha = this.needsAreMet() ? 1 : 0.5
        let newScale = this.needsAreMet() ? (this.currentGainValue > 0 ? 1 : 0) : 0.7

        this.scene.tweens.add(
            {
                targets: this.gainText,
                alpha: newAlpha,
                scale: newScale,
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.InOut
            }
        )

        this.scene.tweens.add(
            {
                targets: this.gainBackground,
                scale: newScale,
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.InOut
            }
        )
    }
}