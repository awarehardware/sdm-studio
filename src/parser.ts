import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"
import { Authors } from "./authors"
import { ScreenPlay } from "./screenplay"

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

////////// Title

function parseTitleOrNull(line: string): Title | null {
    // Define the regular expression with capturing groups
    const regex = /^([A-Za-z])\s*-\s*(.*)$/;

    // Use match() to apply the regex
    const matches = line.match(regex);

    if (matches) {
        // The first letter will be in the first capturing group
        const firstLetter = matches[1];

        // The text after the hyphen will be in the second capturing group
        const textAfterHyphen = matches[2];
        return new Title(firstLetter, textAfterHyphen);
    }

    return null
}

const parseAuthorsOrNull = (line: string): Authors | null => {
    // Another magic regex
    const regex = /^[a]ut\w*\s*:\s*(.*)/i;

    const match = line.match(regex);
    if (match) {
        return new Authors(match[1])
    } else {
        return null
    }
}

////////// Line parser

const parseLine = (line: string): Dialogue | Direction => {
    const dial = parseDialogueOrNull(line);

    if (dial) {
        return dial;
    } else {
        return new Direction(line);
    }
};

////////// Text parser

export const parseText = (text: string): ScreenPlay => {
    // Divide input text in lines
    const splitted: string[] = text.split("\n");

    const result = new ScreenPlay()

    let indexElement = 0;

    for (let i = 0; i < splitted.length; i++) {
        const line = splitted[i];

        if (indexElement == 0) {
            // If no screenplay element have been added yet
            // First try to find title
            const potentialTitle = parseTitleOrNull(line)

            // Title found
            if (potentialTitle) {
                result.title = potentialTitle;
                continue
            }

            // Or try to find author
            const potentialAuthor = parseAuthorsOrNull(line)

            // Title found
            if (potentialAuthor) {
                result.authors = potentialAuthor;
                continue
            }
        }

        const parsed = parseLine(line);
        result.elements[indexElement] = parsed;
        indexElement++;
    }

    return result;
};
