import {GAME_HEIGHT, GAME_WIDTH, MainGameScene} from "../Game";
import {Vector2, vector2Equals} from "../general/MathUtils";
import {Field, FIELD_HEIGHT, FIELD_WIDTH} from "./Field";

export class FieldManager {

    private fields: Map<Vector2, Field>
    private scene: MainGameScene

    private fieldAreaWidth: number;
    private fieldAreaHeight: number;
    private offsetFirstX: number;
    private offsetFirstY: number;
    private columns: number;
    private rows: number;

    constructor(scene: MainGameScene, columns: number, rows: number) {
        this.scene = scene
        this.columns = columns
        this.rows = rows
        this.fields = this.initFields(columns, rows)
    }

    public getPositionForIndex(index: Phaser.Types.Math.Vector2Like): Vector2 {
        return {
            x: this.offsetFirstX + index.x * FIELD_WIDTH,
            y: this.offsetFirstY + index.y * FIELD_HEIGHT
        }
    }

    public getClosestFieldIndexTo(mousePosition: Vector2): Vector2 | undefined {
        let indexX = this.getClosestIndex(this.offsetFirstX, FIELD_WIDTH, this.columns, mousePosition.x)
        let indexY = this.getClosestIndex(this.offsetFirstY, FIELD_HEIGHT, this.rows, mousePosition.y)

        // don't use if (indexX) here since it could be 0
        if (indexX != undefined && indexY != undefined) {
            return {x: indexX, y: indexY}
        }

        return undefined
    }

    public forEachField(param: (field: Field, index: Vector2) => void) {
        [...this.fields.keys()].forEach(vec2 => param(this.fields.get(vec2), vec2))
    }

    public getFieldKeys() {
        return [...this.fields.keys()]
    }

    private initFields(columns: number, rows: number): Map<Vector2, Field> {
        this.columns = columns
        this.rows = rows
        this.fieldAreaWidth = columns * FIELD_WIDTH
        this.fieldAreaHeight = rows * FIELD_HEIGHT
        this.offsetFirstX = (GAME_WIDTH - this.fieldAreaWidth) / 2 + FIELD_WIDTH / 2
        this.offsetFirstY = (GAME_HEIGHT - this.fieldAreaHeight) / 2 + FIELD_HEIGHT / 2 - 50

        let fields = new Map<Vector2, Field>();
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                let field = new Field(this.scene, x, y, this.offsetFirstX + FIELD_WIDTH * x, this.offsetFirstY + FIELD_HEIGHT * y)
                field.alpha = 0
                field.depth = 0
                fields.set({x: x, y: y}, field)
                field.blendIn((Math.abs(x) + Math.abs(y)) * 50, 300)
            }
        }
        return fields
    }

    private getClosestIndex(offset: number, fieldExpansion: number, maxValue: number, value: number): number | undefined {
        let closestIndex = Math.floor((value - offset + fieldExpansion / 2) / fieldExpansion)
        if (closestIndex < 0 || closestIndex >= maxValue) {
            return undefined
        }
        return closestIndex
    }
}