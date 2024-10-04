import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"
import { Authors } from "./authors"

export type ScreenPlayElements = Dialogue | Direction;

export class ScreenPlay {
    title: Title
    authors: Authors
    elements: ScreenPlayElements[];

    constructor() {
        this.title = new Title("X", "No title")
        this.elements = []
        this.authors = new Authors("")
    }
}

