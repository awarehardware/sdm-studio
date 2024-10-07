import { Dialogue } from "./dialogue";
import { Direction } from "./direction";
import { Title } from "./title";
import { Authors } from "./authors";
import { Stage } from "./stage";
import { ScreenPlay } from "./screenplay";
/////
var CHARACTERS = [
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
function parseDialogueOrNull(line) {
    // Magic regex
    var regex = /^(\w+)\s*(?:[, ]\s*(?:\(([^)]+)\)|([a-zA-Zéèêà' ]+)))?\s*:\s*(.+)$/;
    var match = line.match(regex);
    var characterName; // The char
    var direction; // The optional direction (empty if not present)
    var text; // The spoken text
    if (match) {
        characterName = match[1]; // The character name
        direction = match[2] || match[3] || ""; // The optional direction (either in parentheses or not)
        text = match[4]; // The spoken text
    }
    else {
        // No match with regex
        return null;
    }
    // Check if name matches with characters name
    for (var i = 0; i < CHARACTERS.length; i++) {
        // Look for character
        var characterUpper = CHARACTERS[i].toUpperCase();
        if (characterUpper.startsWith(characterName.toUpperCase())) {
            // Character found
            var character = CHARACTERS[i];
            return new Dialogue(character, text, direction);
        }
    }
    return null;
}
////////// Title
function parseTitleOrNull(line) {
    // Define the regular expression with capturing groups
    var regex = /^([A-Za-z])\s*-\s*(.*)$/;
    // Use match() to apply the regex
    var matches = line.match(regex);
    if (matches) {
        // The first letter will be in the first capturing group
        var firstLetter = matches[1];
        // The text after the hyphen will be in the second capturing group
        var textAfterHyphen = matches[2];
        return new Title(firstLetter, textAfterHyphen);
    }
    return null;
}
var parseAuthorsOrNull = function (line) {
    // Another magic regex
    var regex = /^[a]ut\w*\s*:\s*(.*)/i;
    var match = line.match(regex);
    if (match) {
        return new Authors(match[1]);
    }
    else {
        return null;
    }
};
var parseStageOrNull = function (line) {
    // Regex
    var regex = /(\S*)\s*\/\s*(\S*)\s*-\s*(.*)/;
    var match = line.match(regex);
    if (match) {
        var intOrExt = match[1];
        var dayOrNight = match[2];
        var place = match[3];
        return new Stage(intOrExt, dayOrNight, place);
    }
    else {
        return null;
    }
};
////////// Line parser
var parseLine = function (line) {
    var dial = parseDialogueOrNull(line);
    if (dial) {
        return dial;
    }
    else {
        return new Direction(line);
    }
};
////////// Text parser
export var parseText = function (text) {
    // Divide input text in lines
    var splitted = text.split("\n");
    var result = new ScreenPlay();
    var indexElement = 0;
    for (var i = 0; i < splitted.length; i++) {
        var line = splitted[i];
        if (indexElement == 0) {
            // If no screenplay element have been added yet
            // First try to find title
            var potentialTitle = parseTitleOrNull(line);
            // Title found
            if (potentialTitle) {
                result.title = potentialTitle;
                continue;
            }
            // Try to find author
            var potentialAuthor = parseAuthorsOrNull(line);
            // Author found
            if (potentialAuthor) {
                result.authors = potentialAuthor;
                continue;
            }
            // Try to find stage
            var potentialStage = parseStageOrNull(line);
            // Stage found
            if (potentialStage) {
                result.stage = potentialStage;
                continue;
            }
        }
        var parsed = parseLine(line);
        result.elements[indexElement] = parsed;
        indexElement++;
    }
    return result;
};
