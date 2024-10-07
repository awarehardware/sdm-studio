import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"
import { Authors } from "./authors"
import { Stage } from "./stage"

export type ScreenPlayElements = Dialogue | Direction;

export class ScreenPlay {
    stage: Stage
    title: Title
    authors: Authors
    elements: ScreenPlayElements[];

    constructor() {
        this.title = new Title("X", "No title")
        this.elements = []
        this.authors = new Authors("")
        this.stage = new Stage()
    }
}

