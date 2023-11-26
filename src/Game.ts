import * as Phaser from 'phaser';
import {Town} from "./Town";
import {Person} from "./Person";
import GameConfig = Phaser.Types.Core.GameConfig;
import {BUILDINGS} from "./Building";
import {Tent} from "./objects/collectibles/Tent";

export class MainGameScene extends Phaser.Scene {

    people: Person[] = []

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('field', 'assets/field.png');
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
                let field = this.add.image(GAME_WIDTH / 2 + 100 * x, GAME_HEIGHT / 2 + 75 * y, 'field')
                field.alpha = 0
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

        let random = new Phaser.Math.RandomDataGenerator()

        let plusButton = this.add.image(50, GAME_HEIGHT / 2, 'plus')
        plusButton.setInteractive()
        plusButton.on("pointerup", () => {

            let randomBuilding = random.pick(BUILDINGS)
            town.addResource(randomBuilding)
        })
    }

    update(time: number, delta: number) {
        for (let person of this.people) {
            person.update()
        }
    }
}

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

const config: GameConfig = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.NONE,
    backgroundColor: '#FFFFFF',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game',
    zoom: 1 / 2,
    scene: MainGameScene
};

const game = new Phaser.Game(config);
