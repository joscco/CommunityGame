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
    buildingData: BuildingData

    nameText: Text
    costText: Text

    constructor(scene: MainGameScene, x: number, y: number) {
        this.buildingImage = scene.add.image(0, 0, undefined)
        this.buildingImage.scale = 0.8

        this.costText = scene.add.text(0, 80, "0", {
            fontSize: 30,
            color: '000',
            align: "right",
            fontFamily: "Londrina"
        })
        this.costText.setOrigin(0.5)

        this.nameText = scene.add.text(0, -80, "0", {
            fontSize: 30,
            color: '000',
            align: "center",
            fontFamily: "Londrina"
        })
        this.nameText.setOrigin(0.5, 0.5)

        this.container = scene.add.container(x, y, [this.buildingImage, this.costText, this.nameText])
        this.container.setScale(0)

        this.buildingImage.setInteractive()
        this.buildingImage.on("pointerdown", (pointer: Pointer) =>
            this.addNewBuildingAndDrag(scene, pointer))
    }

    setBuildingData(buildingData: BuildingData, delay: number) {
        this.buildingData = buildingData

        this.container.scene.tweens.chain({
            targets: this.container,
            tweens: [{
                scaleX: 0,
                scaleY: 1,
                delay: delay,
                duration: 150,
                ease: Phaser.Math.Easing.Back.In,
                onComplete: () => {
                    this.buildingImage.setTexture(buildingData.textureName)
                    this.nameText.text = buildingData.displayName
                    this.updateNumber(buildingData.pointsNeeded)
                }
            }, {
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: Phaser.Math.Easing.Back.Out
            }]
        })

    }

    private addNewBuildingAndDrag(scene: MainGameScene, pointer: Phaser.Input.Pointer) {
        let building = new Building(scene, pointer.x, pointer.y, this.buildingData)
        scene.dragBuilding(building)
    }

    updateNumber(value: number) {
        this.costText.text = "≥ " + value + " P"
    }
}