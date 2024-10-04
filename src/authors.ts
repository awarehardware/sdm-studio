import { Paragraph, TextRun } from "docx"

export class Authors {
    content: string;

    constructor(content: string) {
        this.content = content;
    }

    isMultiple() {
        return this.content.includes('&')
    }

    getPrefixString(): string {
        if (this.isMultiple()) {
            return "Auteurs :"
        } else {
            return "Auteur :"
        }
    }

    asString(): string {
        return `${this.getPrefixString()} ${this.content}`
    }

    getRenderedHtml(): HTMLElement {
        const p = document.createElement("p");
        p.classList.add("dialogue-text");

        if (p) {
            p.textContent += this.asString();
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
                style: "text"
            })]
    }
}

