import {Scene} from 'phaser';
import {TENT} from "../../Building";
import {CollectibleEntity} from "./CollectibleEntity";

export class Tent extends CollectibleEntity {

    constructor(scene: Scene, x: number, y: number ) {
        super(scene, x, y, TENT);
    }

}