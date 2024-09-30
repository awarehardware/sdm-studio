import { Paragraph, TextRun } from "docx"

export class Dialogue {
    character: string;
    text: string;
    direction: string | null;

    constructor(character: string, text: string, direction: string) {
        this.character = character;
        this.text = text;
        this.direction = direction;
    }

    getRenderedHtml(): HTMLElement {
        // Create the main div container
        const container = document.createElement("div");

        // Create and append the line containing both character and direction
        const characterDirectionLine = document.createElement("p");

        // Create a bold element for the character
        const characterElement = document.createElement("strong");
        characterElement.textContent = `${this.character}`;

        // Append the character element to the line
        characterDirectionLine.appendChild(characterElement);
        characterDirectionLine.classList.add("character-direction");

        // If direction exists, add it in italics
        if (this.direction) {
            const space = document.createTextNode(", "); // Add comma and space
            characterDirectionLine.appendChild(space);

            const directionElement = document.createElement("em");
            directionElement.textContent = this.direction;
            characterDirectionLine.appendChild(directionElement);
        }

        // Add the character and direction line to the container
        container.appendChild(characterDirectionLine);

        // Create and append the text element for the dialogue
        const textElement = document.createElement("p");
        textElement.textContent = this.text;
        textElement.classList.add("dialogue-text");

        // Append the dialogue text below the character and direction line
        container.appendChild(textElement);

        return container;
    }

    getRenderedDocxParagraph(): Array<Paragraph> {
        const result: Paragraph[] = []

        // Paragraph with character and potential direction
        let characterParagraph = new Paragraph({
            children: [
                new TextRun(
                    {
                        text: this.character.toUpperCase(),
                        break: 1,
                    },
                ),
            ],

            style: "character"
        })

        // Add direction
        if (this.direction) {
            characterParagraph.addChildElement(new TextRun(
                {
                    text: ", ".concat(this.direction),
                    italics: true,
                    bold: false
                }
            ))
        }

        // Paragraph with text
        let textParagraph = new Paragraph({
            style: "text"
        })

        textParagraph.addChildElement(
            new TextRun(
                {
                    text: this.text,
                }
            )
        )
        result[0] = characterParagraph
        result[1] = textParagraph
        return result;
    }
}

