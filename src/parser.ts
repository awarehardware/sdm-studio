import { Dialogue } from "./dialogue"
import { Direction } from "./direction"
import { Title } from "./title"
import { Authors } from "./authors"
import { Stage } from "./stage"
import { ScreenPlay } from "./screenplay"
import { Autonaming } from "./autonaming"

function parsedDialogueSortcutedOrNull(line: string, autonaming: Autonaming): Dialogue | null {
    // Match "- text"
    const regex = /\s*-\s*(.*[^\s])\s*/;
    const match = line.match(regex);

    // No match
    if (!match) {
        return null
    }

    let character = autonaming.getDashGuess()
    let text = match[1]
    return new Dialogue(character, text, "")
}

function parseDialogueOrNull(line: string, autonaming: Autonaming): Dialogue | null {
    // Match "char, direction : text". Direction is optional
    const regex = /\s*([^,]*[^\s])\s*(?:,\s*(.*[^\s])\s*)?:\s*(.+)\s*/;
    const match = line.match(regex);

    let character: string; // Character prefix or name
    let direction: string; // The optional direction (empty if not present)
    let text: string; // The spoken text

    if (!match) {
        // No match with regex
        return null;
    }

    character = match[1].toUpperCase();
    direction = match[2];
    text = match[3];

    // Apply autonaming
    if (character == '-') {
        // Dash detected
        character = autonaming.getDashGuess()
    } else {
        // Get matching prefix if exists
        character = autonaming.getPrefixGuess(character) ?? character
    }

    return new Dialogue(character, text, direction);
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

const parseStageOrNull = (line: string): Stage | null => {
    // Regex
    const regex = /(\S*)\s*\/\s*(\S*)\s*-\s*(.*)/;
    const match = line.match(regex)

    if (match) {
        let intOrExt = match[1]
        let dayOrNight = match[2]
        let place = match[3]
        return new Stage(intOrExt, dayOrNight, place)
    } else {
        return null;
    }
}

////////// Line parser

const parseLine = (line: string, autonaming: Autonaming): Dialogue | Direction => {

    // Check if dial is full dialogue
    let dial = parseDialogueOrNull(line, autonaming);

    // Check if dial is shortcuted dialogue
    dial = dial ?? parsedDialogueSortcutedOrNull(line, autonaming)

    if (dial) {
        // Update autonaming engine
        autonaming.updateWithDialogue(dial)
        return dial;
    } else {
        // Not a dial: return direction
        return new Direction(line);
    }
};

////////// Text parser

export const parseText = (text: string): ScreenPlay => {
    // Divide input text in lines
    const splitted: string[] = text.split("\n");

    const result = new ScreenPlay()
    let autonaming = new Autonaming()
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
                autonaming.updateWithCouple(potentialTitle.coupleLetter)
                continue
            }

            // Try to find author
            const potentialAuthor = parseAuthorsOrNull(line)

            // Author found
            if (potentialAuthor) {
                result.authors = potentialAuthor;
                continue
            }

            // Try to find stage
            const potentialStage = parseStageOrNull(line)

            // Stage found
            if (potentialStage) {
                result.stage = potentialStage;
                continue
            }
        }

        const parsed = parseLine(line, autonaming);
        result.elements[indexElement] = parsed;
        indexElement++;
    }

    return result;
};
