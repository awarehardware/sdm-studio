import { Paragraph, TextRun } from "docx"

export class Title {
    coupleLetter: string
    title: string;

    constructor(coupleLetter: string, title: string) {
        this.coupleLetter = coupleLetter
        this.title = title;
    }

    asString(): string {
        return `${this.coupleLetter.toUpperCase()} - ${this.title.toUpperCase()}`
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
                    }),
                ],
                style: "title"
            })]
    }
}

