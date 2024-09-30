import { Paragraph, TextRun } from "docx"

export class Title {
    coupleLetter: string
    title: string;

    constructor(coupleLetter: string, title: string) {
        this.coupleLetter = coupleLetter
        this.title = title;
    }

    private asString(): string {
        return `${this.coupleLetter} - ${this.title}`
    }

    getRenderedHtml(): HTMLElement {
        const p = document.createElement("p");
        p.classList.add("direction");

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
                        break: 1
                    }),
                ],
                style: "direction"
            })]
    }
}

