import {Scene} from 'phaser';
import {CollectibleEntity} from "./CollectibleEntity";
import {PINE} from "../../Building";

export class Pine extends CollectibleEntity {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, PINE);
    }

}