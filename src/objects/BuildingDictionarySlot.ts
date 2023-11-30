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
    slot: Image
    buildingImage: Image
    shown: boolean
    buildingData: BuildingData
    costText: Text
    starIcon: Image
    private scaleTween: Tween;

    constructor(scene: MainGameScene, x: number, y: number) {

        this.slot = scene.add.image(x, y, 'inventory/slot')
        this.buildingImage = scene.add.image(0, 0, undefined)
        this.buildingImage.setOrigin(0.5, 1)
        this.buildingImage.scale = 0.8
        this.costText = scene.add.text(-30, 15, "0", {
            fontSize: 30,
            color: '000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.starIcon = scene.add.image(15, 25, 'star')
        this.container = scene.add.container(x, y, [this.buildingImage, this.costText, this.starIcon])
        this.container.setScale(0, 0)

        this.slot.setInteractive()
        this.buildingImage.setInteractive()
        this.buildingImage.on("pointerdown", (pointer: Pointer) =>
            this.addNewBuildingAndDrag(scene, pointer))
        this.slot.on("pointerdown", (pointer: Pointer) =>
            this.addNewBuildingAndDrag(scene, pointer))

        this.shown = false
    }

    setBuildingData(buildingData: BuildingData) {
        this.buildingData = buildingData
        this.buildingImage.setTexture(buildingData.textureName)
    }

    private addNewBuildingAndDrag(scene: MainGameScene, pointer: Phaser.Input.Pointer) {
        if (this.shown) {
            let building = new Building(scene, pointer.x, pointer.y, this.buildingData)
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