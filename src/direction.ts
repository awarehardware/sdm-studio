import { Paragraph, TextRun } from "docx"

export class Direction {
    content: string;

    constructor(content: string) {
        this.content = content;
    }

    getRenderedHtml(): HTMLElement {
        const p = document.createElement("p");
        p.classList.add("direction");

        if (p) {
            p.textContent += `${this.content}`;
        }
        return p;
    }

    getRenderedDocxParagraph(): Array<Paragraph> {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.content,
                        break: 1
                    }),
                ],
                style: "direction"
            })]
    }
}

