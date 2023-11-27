import {Scene} from "phaser";
import {BuildingData} from "./BuildingData";
import Image = Phaser.GameObjects.Image;

export class Building extends Image {
    constructor(scene: Scene, x: number, y: number, buildingData: BuildingData) {
        super(scene, x, y, buildingData.textureName)
        scene.add.existing(this)
        this.setInteractive({draggable: true})
    }
}