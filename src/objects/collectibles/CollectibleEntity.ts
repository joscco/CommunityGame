import {IEntity} from "../../Interfaces/IEntity";
import {Town} from "../../Town";
import {Building} from "../../Building";
import {Scene} from "phaser";

export class CollectibleEntity extends Phaser.GameObjects.Image implements IEntity {

    resource: Building

    constructor(scene: Scene, x: number, y: number, resource: Building) {
        super(scene, x, y, resource.textureName);
        this.scene.add.existing(this)
        this.depth = y
        this.resource = resource
        this.setInteractive()
    }

    onClick(town: Town) {
        town.addResource(this.resource)
        this.remove()
    }

    remove() {
        this.removeInteractive()
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            ease: Phaser.Math.Easing.Back.In,
            duration: 300,
            onComplete: () => this.destroy()
        })
    }
}