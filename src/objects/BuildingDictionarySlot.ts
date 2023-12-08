import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import Pointer = Phaser.Input.Pointer;
import {BuildingData} from "./BuildingData";
import {MainGameScene} from "../Game";
import {Building} from "./Building";
import Tween = Phaser.Tweens.Tween;

export class BuildingDictionarySlot {
    container: Container
    buildingImage: Image
    shown: boolean
    buildingData: BuildingData

    nameText: Text
    costText: Text
    coinIcon: Image
    private scaleTween: Tween;

    constructor(scene: MainGameScene, x: number, y: number) {
        this.buildingImage = scene.add.image(0, 0, undefined)
        this.buildingImage.scale = 0.8

        this.costText = scene.add.text(-15, 80, "0", {
            fontSize: 30,
            color: '000',
            align: "right",
            fontFamily: "Londrina"
        })
        this.costText.setOrigin(1, 0.5)

        this.nameText = scene.add.text(0, -80, "0", {
            fontSize: 30,
            color: '000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.nameText.setOrigin(0.5, 0.5)

        this.coinIcon = scene.add.image(-5, 80, 'coin')
        this.coinIcon.setOrigin(0, 0.5)
        this.container = scene.add.container(x, y, [this.buildingImage, this.costText, this.nameText, this.coinIcon])
        this.container.setScale(0, 0)

        this.buildingImage.setInteractive()
        this.buildingImage.on("pointerdown", (pointer: Pointer) =>
            this.addNewBuildingAndDrag(scene, pointer))

        this.shown = false
    }

    setBuildingData(buildingData: BuildingData) {
        this.buildingData = buildingData
        this.buildingImage.setTexture(buildingData.textureName)
        this.nameText.text = buildingData.name
    }

    private addNewBuildingAndDrag(scene: MainGameScene, pointer: Phaser.Input.Pointer) {
        if (this.shown) {
            let building = new Building(scene, {x: 0, y: 0}, pointer.x, pointer.y, this.buildingData)
            scene.dragBuilding(building)
        }
    }

    blendIn() {
        this.tweenScaleTo(1, 300, true)
    }

    private tweenScaleTo(scale: number, duration: number, shownAfter: boolean) {
        this.scaleTween?.remove()
        this.shown = shownAfter
        this.scaleTween = this.container.scene.tweens.add({
            targets: this.container,
            scaleX: scale,
            scaleY: scale,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: duration
        })
    }

    updateNumber(value: number) {
        this.costText.text = value + ""
    }
}