import { Paragraph, TextRun } from "docx"

export class Stage {
    intOrExt: string;
    dayOrNight: string;
    place: string;

    constructor(intOrExt: string = "INT", dayOrNight: string = "JOUR", place: string = "") {
        this.intOrExt = intOrExt;
        this.dayOrNight = dayOrNight;
        this.place = place;
    }

    asString(): string {
        return `${this.intOrExt.toUpperCase()} / ${this.dayOrNight.toUpperCase()} - ${this.place.toUpperCase()}`
    }

    getRenderedHtml(): HTMLElement {
        const p = document.createElement("strong");
        p.classList.add("title");

        if (p) {
            p.textContent += this.asString()
        }
        return p;
    }

    getRenderedDocxParagraph(): Array<Paragraph> {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.asString(),
                        break: 0
                    }),
                ],
                style: "title"
            })]
    }
}

