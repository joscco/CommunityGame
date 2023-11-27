import * as Phaser from 'phaser';
import {Town} from "./objects/Town";
import {Person} from "./objects/Person";
import {Tent} from "./objects/collectibles/Tent";
import {AddBuildingButton} from "./objects/AddBuildingButton";
import GameConfig = Phaser.Types.Core.GameConfig;
import {Building} from "./objects/Building";
import Pointer = Phaser.Input.Pointer;
import {Field} from "./objects/Field";

export class MainGameScene extends Phaser.Scene {

    people: Person[] = []
    fields: Field[] = []
    draggedBuilding?: Building
    dragging: boolean

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('field_inner', 'assets/fieldInner.png');
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
        let town = new Town(this)

        for (let x = -6; x <= 6; x++) {
            for (let y = -4; y <= 4; y++) {
                let field = new Field(this, GAME_WIDTH / 2 + 100 * x, GAME_HEIGHT / 2 + 75 * y)
                field.alpha = 0
                field.depth = 0
                this.fields.push(field)
                this.tweens.add({
                    targets: field,
                    alpha: 1,
                    delay: (Math.abs(x) + Math.abs(y)) * 200,
                    duration: 300,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                })
            }
        }

        // Add tent
        let tent = new Tent(this, GAME_WIDTH/2, GAME_HEIGHT/2)
        tent.scale = 0
        tent.depth = GAME_HEIGHT / 2 + 30
        this.tweens.add({
            targets: tent,
            scale: 1,
            delay: 1200,
            duration: 300,
            ease: Phaser.Math.Easing.Back.Out
        })


        // Add person
        let person = new Person(this, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        person.scale = 0

        this.people.push(person)
        town.addEntity(person)

        this.tweens.add({
            targets: person,
            scale: 1,
            delay: 1500,
            duration: 300,
            ease: Phaser.Math.Easing.Back.Out
        })

        this.input.on('pointermove', (pointer: Pointer) => {
            if (this.dragging && this.draggedBuilding) {
                this.draggedBuilding.x = pointer.x
                this.draggedBuilding.y = pointer.y
                this.fields.filter(field => Phaser.Math.Distance.Between(pointer.x, pointer.y, field.x, field.y) < 100)
                    .forEach(field => field.blendInInner())
                this.fields.filter(field => Phaser.Math.Distance.Between(pointer.x, pointer.y, field.x, field.y) >= 100)
                    .forEach(field => field.blendOutInner())
            }
        })

        this.input.on('pointerup', (pointer: Pointer) => {
            if (this.dragging && this.draggedBuilding) {
                this.draggedBuilding.destroy()

            }
            this.fields.forEach(field => field.blendOutInner())
            this.dragging = false
        })


        let plusButton = new AddBuildingButton(this, 50, GAME_HEIGHT / 2, town)
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
