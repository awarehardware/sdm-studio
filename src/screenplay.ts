import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"

export type ScreenPlayElements = Dialogue | Direction;

export class ScreenPlay {
    title: Title
    elements: ScreenPlayElements[];

    constructor() {
        this.title = new Title("X", "No title")
        this.elements = []
    }
}

