import { Paragraph, TextRun } from "docx";
var Dialogue = /** @class */ (function () {
    function Dialogue(character, text, direction) {
        this.character = character;
        this.text = text;
        this.direction = direction;
    }
    Dialogue.prototype.getRenderedHtml = function () {
        // Create the main div container
        var container = document.createElement("div");
        // Create and append the line containing both character and direction
        var characterDirectionLine = document.createElement("p");
        // Create a bold element for the character
        var characterElement = document.createElement("strong");
        characterElement.textContent = "".concat(this.character);
        // Append the character element to the line
        characterDirectionLine.appendChild(characterElement);
        characterDirectionLine.classList.add("character-direction");
        // If direction exists, add it in italics
        if (this.direction) {
            var space = document.createTextNode(", "); // Add comma and space
            characterDirectionLine.appendChild(space);
            var directionElement = document.createElement("em");
            directionElement.textContent = this.direction;
            characterDirectionLine.appendChild(directionElement);
        }
        // Add the character and direction line to the container
        container.appendChild(characterDirectionLine);
        // Create and append the text element for the dialogue
        var textElement = document.createElement("p");
        textElement.textContent = this.text;
        textElement.classList.add("dialogue-text");
        // Append the dialogue text below the character and direction line
        container.appendChild(textElement);
        return container;
    };
    Dialogue.prototype.getRenderedDocxParagraph = function () {
        var result = [];
        // Paragraph with character and potential direction
        var characterParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: this.character.toUpperCase(),
                    break: 1,
                }),
            ],
            style: "character"
        });
        // Add direction
        if (this.direction) {
            characterParagraph.addChildElement(new TextRun({
                text: ", ".concat(this.direction),
                italics: true,
                bold: false
            }));
        }
        // Paragraph with text
        var textParagraph = new Paragraph({
            style: "text"
        });
        textParagraph.addChildElement(new TextRun({
            text: this.text,
        }));
        result[0] = characterParagraph;
        result[1] = textParagraph;
        return result;
    };
    return Dialogue;
}());
export { Dialogue };
