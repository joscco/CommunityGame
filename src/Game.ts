import * as Phaser from 'phaser';
import {Town} from "./objects/Town";
import {Person} from "./objects/Person";
import {Building} from "./objects/Building";
import {BUILDINGS, TENT} from "./objects/BuildingData";
import GameConfig = Phaser.Types.Core.GameConfig;
import Center = Phaser.Scale.Center;

export class MainGameScene extends Phaser.Scene {

    people: Person[] = []
    draggedBuilding?: Building
    dragging: boolean
    town: Town;

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('field', 'assets/images/field.png');
        this.load.image('field_inner', 'assets/images/fieldInner.png');
        this.load.image('field_inner_canceled', 'assets/images/fieldInnerCanceled.png');
        this.load.image('person', 'assets/images/person.png');

        // plants
        this.load.image('buildings/tent', 'assets/images/tent.png');
        this.load.image('buildings/big_tent', 'assets/images/big_tent.png');
        this.load.image('buildings/fire', 'assets/images/fire.png');
        this.load.image('buildings/hut', 'assets/images/hut.png');
        this.load.image('buildings/pine', 'assets/images/pine.png');
        this.load.image('buildings/house', 'assets/images/house.png');
        this.load.image('buildings/tall_house', 'assets/images/tall_house.png');
        this.load.image('buildings/court', 'assets/images/court.png');

        // UI
        this.load.image('star', 'assets/images/star.png');
        this.load.image('inventory/slot', 'assets/images/inventory_slot.png');
    }

    create() {
        this.town = new Town(this, 9, 13)

        BUILDINGS.forEach(building => this.town.catalogue.set(building, false))
        BUILDINGS.filter(building => !building.recipe)
            .forEach(building => this.town.addToCatalogue(building))

        // Add person
        for (let i = 0; i < 5; i++) {
            let person = new Person(
                this,
                GAME_WIDTH / 2 - 150 + Math.random() * 300,
                GAME_HEIGHT / 2 - 150 + Math.random() * 300
            )
            person.scale = 0
            this.people.push(person)

            this.tweens.add({
                targets: person,
                scale: 1,
                duration: 300,
                ease: Phaser.Math.Easing.Back.Out
            })
        }

        // Add tent
        let tent = new Building(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, TENT)
        tent.scale = 0
        this.town.setBuildingAt([{x: 6, y: 4}], tent)
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
    transparent: true,
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        autoCenter: Center.CENTER_BOTH,
        min: {
            width: GAME_WIDTH / 2,
            height: GAME_HEIGHT / 2
        },
        max: {
            width: GAME_WIDTH,
            height: GAME_HEIGHT
        }
    },
    scene: MainGameScene,
};

const game = new Phaser.Game(config);
