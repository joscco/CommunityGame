import * as Phaser from 'phaser';
import {Town} from "./objects/Town";
import {Person} from "./objects/Person";
import {Building} from "./objects/Building";
import {BUILDINGS, PINE, TENT} from "./objects/BuildingData";
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
        this.load.image('field', 'assets/field.png');
        this.load.image('field_inner', 'assets/fieldInner.png');
        this.load.image('field_inner_canceled', 'assets/fieldInnerCanceled.png');
        this.load.image('person', 'assets/person.png');

        // plants
        this.load.image('buildings/tent', 'assets/tent.png');
        this.load.image('buildings/big_tent', 'assets/big_tent.png');
        this.load.image('buildings/fire', 'assets/fire.png');
        this.load.image('buildings/hut', 'assets/hut.png');
        this.load.image('buildings/pine', 'assets/pine.png');
        this.load.image('buildings/house', 'assets/house.png');
        this.load.image('buildings/tall_house', 'assets/tall_house.png');

        // UI
        this.load.image('star', 'assets/star.png');
        this.load.image('inventory/slot', 'assets/inventory_slot.png');
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
