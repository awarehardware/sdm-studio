import { Dialogue } from "./dialogue"

const COUPLES: { [key: string]: string[] } = {
    'B': ['JOSE', 'LILIANE'],
    'C': ['RAYMOND'],
    'D': ['EMMA', 'FABIEN'],
    'E': ['CAMILLE', 'PHILIPPE'],
    'F': ['LEO', 'LESLIE'],
    'I': ['ALICE', 'SOFIANE']
}

const DEFAULT_COUPLE = 'D'

export class Autonaming {
    poolCharacters: string[]
    usedCharacters: string[]
    lastCharacterIndex: number | null

    constructor() {
        // Potential characters, can be used or not
        this.poolCharacters = COUPLES[DEFAULT_COUPLE]
        // Used characters
        this.usedCharacters = []
        this.lastCharacterIndex = null;
    }

    updateWithDialogue(dialogue: Dialogue) {
        if (this.usedCharacters && !this.usedCharacters.includes(dialogue.character)) {
            this.usedCharacters.push(dialogue.character)
        }

        this.lastCharacterIndex = this.usedCharacters.indexOf(dialogue.character)

    }

    updateWithCouple(coupleId: string) {
        // Update autonaming engine with couple ID
        // Fill character pool with characters from couple universe
        if (!(coupleId in COUPLES)) {
            // Wrong couple id
            return
        }

        this.poolCharacters = COUPLES[coupleId]
    }

    _getNextUsedCharacter(): null | string {
        // Check if next character available
        if (this.lastCharacterIndex == null) {
            // No "last character"
            return null
        }

        if (this.usedCharacters.length <= 1) {
            // Only one character used
            return null
        }

        const index = (this.lastCharacterIndex + 1) % (this.usedCharacters.length)
        return this.usedCharacters[index]
    }

    _getFirstUnusedCharacter(): null | string {
        for (let i = 0; i < this.poolCharacters.length; i++) {
            let char = this.poolCharacters[i]

            if (!(this.usedCharacters.includes(char))) {
                return char
            }
        }
        return null
    }

    getDashGuess(): string {
        // Return next character if available
        let nextChar = this._getNextUsedCharacter()
        if (nextChar) {
            return nextChar
        }

        // Return first unused character from pool if available
        nextChar = this._getFirstUnusedCharacter()
        if (nextChar) {
            return nextChar
        }

        // Default case
        return this.poolCharacters[0]
    }

    _searchPrefixMatchInCharacterList(prefix: string, characterList: string[], forbiddenCharacter: string | null) {
        // Work on uppercase prefix and forbidden char
        prefix = prefix.toUpperCase()

        if (forbiddenCharacter) {
            forbiddenCharacter = forbiddenCharacter.toUpperCase()
        }


        // Search prefix match in used character
        for (let i = 0; i < characterList.length; i++) {
            let character = characterList[i]

            if (character == forbiddenCharacter) {
                continue
            }

            if (character.startsWith(prefix)) {
                return character
            }
        }

        return null
    }

    getPrefixGuess(prefix: string): string | null {
        // Return first character matching with prefix
        // - From used character list, excepted last used character
        // - Then, from character pool, excepted last used character
        // Return null if no match

        // Work on uppercase prefix
        prefix = prefix.toUpperCase()

        // Compute last used character
        let lastUsedCharacter: string | null = null;
        if (this.lastCharacterIndex != null) {
            lastUsedCharacter = this.usedCharacters[this.lastCharacterIndex]
        }

        let match = null;

        // Search prefix match in used character 
        match = this._searchPrefixMatchInCharacterList(prefix, this.usedCharacters, lastUsedCharacter)
        if (match) {
            return match
        }

        // Search prefix match in pool character 
        match = this._searchPrefixMatchInCharacterList(prefix, this.poolCharacters, lastUsedCharacter)
        if (match) {
            return match
        }

        return null
    }
}
