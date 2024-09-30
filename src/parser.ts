import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"

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
