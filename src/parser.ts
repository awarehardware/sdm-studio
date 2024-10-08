import { Alignment, AlignmentType, HeadingLevel, Paragraph, TextRun } from "docx";

/////

const CHARACTERS: string[] = [
  "EMMA",
  "FABIEN",
  "LILIANE",
  "JOSE",
  "RAYMOND",
  "CAMILLE",
  "PHILIPPE",
  "LEO",
  "LESLIE",
  "AUDREY",
  "SOFIANE"
];

//////// Dialogue ////////

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

  getRenderedDocxParagraph(): Array<Paragraph>  {
    const result: Paragraph[] = []

    // Paragraph with character and potential direction
    let characterParagraph = new Paragraph({
       children: [
        new TextRun(
          {
            text: this.character.toUpperCase(),
            break: 1
          },
        ),
       ],
       heading: HeadingLevel.HEADING_2
    })

    // Add direction
    if (this.direction) {
      characterParagraph.addChildElement(new TextRun(
        {
          text: ", ".concat(this.direction),
          style: "Normal",
          italics: true,
          bold: false
        }
      ))
    }

    // Paragraph with text
    let textParagraph = new Paragraph({
        text: this.text,
    })

    result[0] = characterParagraph
    result[1] = textParagraph
    return result;
  }
}

function parseDialogueOrNull(line: string): Dialogue | null {
  // Magic regex
  const regex =
    /^(\w+)\s*(?:[, ]\s*(?:\(([^)]+)\)|([a-zA-Zéèêà' ]+)))?\s*:\s*(.+)$/;
  const match = line.match(regex);

  let characterName: string; // The char
  let direction: string; // The optional direction (empty if not present)
  let text: string; // The spoken text

  if (match) {
    characterName = match[1]; // The character name
    direction = match[2] || match[3] || ""; // The optional direction (either in parentheses or not)
    text = match[4]; // The spoken text
  } else {
    // No match with regex
    return null;
  }

  // Check if name matches with characters name
  for (let i = 0; i < CHARACTERS.length; i++) {
    // Look for character
    const characterUpper = CHARACTERS[i].toUpperCase();

    if (characterUpper.startsWith(characterName.toUpperCase())) {
      // Character found
      const character = CHARACTERS[i];
      return new Dialogue(character, text, direction);
    }
  }
  return null;
}

///////// Direction ///////////:

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
    return [new Paragraph({
      children: [
        new TextRun({
          text: this.content,
          italics: true,
          break: 1
        }),
      ],
    })]
  }
}

////////// Line parser

export type ScreenPlayElements = Dialogue | Direction;

const parseLine = (line: string): Dialogue | Direction => {
  const dial = parseDialogueOrNull(line);

  if (dial) {
    return dial;
  } else {
    return new Direction(line);
  }
};

export const parseText = (text: string): ScreenPlayElements[] => {
  const splitted: string[] = text.split("\n");

  const result: ScreenPlayElements[] = [];

  for (let i = 0; i < splitted.length; i++) {
    const line = splitted[i];
    const parsed = parseLine(line);
    result[i] = parsed;
  }

  return result;
};
