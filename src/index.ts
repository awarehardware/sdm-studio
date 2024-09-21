
import * as docx from "docx";

import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from 'file-saver';

import { parseLine } from "./parser";

const liveRendering = (text: String) => {
    const splitted: string[] = text.split('\n')
    const testElement = document.getElementById("test")

    if (testElement == null) {
        return
    }

    // Create a new paragraph element with text content
    testElement.innerHTML = ""

    // Append the paragraph to the div
    for (let i = 0; i < splitted.length; i++) {
        const line = splitted[i]
        const parsed = parseLine(line)
        testElement.appendChild(parsed.getRenderedHtml())
    }
}

////////

// Get the input element by its ID
const inputElement = document.getElementById("userInput") as HTMLTextAreaElement;

// Add an event listener to capture the input change event
inputElement.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;

    const text = target.value
    liveRendering(text)
});

async function generateDoc() {

    // Get the text from the input field
    let inputText = "hello"

    // Create a new Document with the input text
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: inputText || "No input provided", // Default message if empty
                                bold: true,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    // Pack the document into a blob and trigger download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "generated_document.docx");
}

// generateDoc()
