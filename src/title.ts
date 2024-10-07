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
        const paragraph = document.createElement("p");
        paragraph.classList.add("title");

        // Strong within paragraph
        const strong = document.createElement("strong");
        strong.textContent = this.asString()
        paragraph.appendChild(strong)

        return paragraph;
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
                style: "title"
            })]
    }
}

