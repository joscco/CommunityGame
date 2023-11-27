import * as Phaser from 'phaser';
import {Town} from "./objects/Town";
import {Person} from "./objects/Person";
import {AddBuildingButton} from "./objects/AddBuildingButton";
import {Building} from "./objects/Building";
import {TENT} from "./objects/BuildingData";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MainGameScene extends Phaser.Scene {

    people: Person[] = []
    draggedBuilding?: Building
    dragging: boolean
    town: Town;

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('field_inner', 'assets/fieldInner.png');
        this.load.image('field_inner_canceled', 'assets/fieldInnerCanceled.png');
        this.load.image('person', 'assets/person.png');

        // plants
        this.load.image('plus', 'assets/plusSign.png');
        this.load.image('buildings/tent', 'assets/tent.png');
        this.load.image('buildings/pine', 'assets/pine.png');
        this.load.image('buildings/house_1', 'assets/house_1.png');
        this.load.image('buildings/house_2', 'assets/house_2.png');
        this.load.image('buildings/house_3', 'assets/house_3.png');
        // UI
        this.load.image('inventory/slot', 'assets/inventory_slot.png');

    }

    create() {
        this.town = new Town(this, 9, 13)

        // Add tent
        let tent = new Building(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, TENT)
        tent.scale = 0
        this.town.setBuildingAt([{x: 6, y: 4}], tent)

        this.tweens.add({
            targets: tent,
            scale: 1,
            delay: 1200,
            duration: 300,
            ease: Phaser.Math.Easing.Back.Out
        })

        // Add person
        for (let i = 0; i < 15; i++) {
            let person = new Person(this, GAME_WIDTH / 2, GAME_HEIGHT / 2)
            person.scale = 0
            this.people.push(person)

            this.tweens.add({
                targets: person,
                scale: 1,
                delay: 1500,
                duration: 300,
                ease: Phaser.Math.Easing.Back.Out
            })
        }


        let plusButton = new AddBuildingButton(this, 50, GAME_HEIGHT / 2, this.town)
    }

    update(time: number, delta: number) {
        for (let person of this.people) {
            person.update()
        }
    }

    dragBuilding(building: Building) {
        this.draggedBuilding = building
        this.dragging = true
        building.depth = GAME_HEIGHT
        this.children.bringToTop(building)
    }


}

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

const config: GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    transparent: true,
    parent: 'game',
    scale: {
        mode: Phaser.Scale.NONE,
        zoom: 1 / 2
    },
    scene: MainGameScene,
};

const game = new Phaser.Game(config);
