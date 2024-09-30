import { AlignmentType, Document, Packer } from "docx";
import { saveAs } from "file-saver";
import { parseText } from "./parser";
import { loadSavedInput, saveInputOnChange } from "./autosaver"
import { ScreenPlay } from "./screenplay"

import './styles.css';

//////

// Your TypeScript code

const parseUserInput = (): ScreenPlay => {
    const userInput = document.getElementById("userInput") as HTMLTextAreaElement;
    // Parse text
    if (userInput.value) {
        return parseText(userInput.value);
    } else {
        return parseText("")
    }
};

const liveRendering = () => {
    // Get the preview text area
    const liveRenderDivElement = document.getElementById("liveRenderDiv");

    if (liveRenderDivElement == null) {
        return;
    }

    // Create a new paragraph element with text content
    liveRenderDivElement.innerHTML = "";

    // Parse text from userInput
    const screenplay = parseUserInput();

    // Append title
    liveRenderDivElement.appendChild(screenplay.title.getRenderedHtml())

    // Append the paragraph to the div
    for (let i = 0; i < screenplay.elements?.length; i++) {
        const element = screenplay.elements[i];
        liveRenderDivElement.appendChild(element.getRenderedHtml());
    }
};

////////

///// Plug live rendering on user input

// Get the input element by its ID
const inputElement = document.getElementById(
    "userInput"
) as HTMLTextAreaElement;

// Add an event listener to capture the input change event
inputElement.addEventListener("input", (_) => {
    liveRendering();
});

///

async function generateDoc() {
    // Get the text from the input field
    const section_children = [];
    const screenplay = parseUserInput();

    // Render title
    section_children.push(...screenplay.title.getRenderedDocxParagraph());
    
    // Render screenplay elements
    for (let i = 0; i < screenplay.elements.length; i++) {
        section_children.push(...screenplay.elements[i].getRenderedDocxParagraph());
    }

    // The first argument is an ID you use to apply the style to paragraphs
    // The second argument is a human-friendly name to show in the UI
    let doc = new Document({
        creator: "Clippy",
        title: "Sample Document",
        description: "A brief example of using docx",
        sections: [{
            children: section_children
        }],


        styles: {
            paragraphStyles: [
                {
                    id: "character",
                    name: "character",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        bold: true,
                        font: "Times New Roman",
                        size: 26
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                    }
                },
                {
                    id: "title",
                    name: "title",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        bold: true,
                        font: "Times New Roman",
                        size: 26
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT,
                    }
                },
                {
                    id: "text",
                    name: "text",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        bold: false,
                        font: "Times New Roman",
                        size: 26
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT,
                    }
                },
                {
                    id: "direction",
                    name: "direction",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        bold: false,
                        italics: true,
                        font: "Times New Roman",
                        size: 26
                    },
                    paragraph: {
                    }
                }

            ]
        },

    });

    // Pack the document into a blob and trigger download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "generated_document.docx");
}

///// Plug download button

const downloadButtonCallback = () => {
    generateDoc();
};

const downloadButton = document.getElementById(
    "downloadButton"
) as HTMLButtonElement;
downloadButton.addEventListener("click", downloadButtonCallback);

///// Run these functions when the page loads

window.onload = function(): void {
    loadSavedInput(); // Load saved input from cookies
    saveInputOnChange(); // Attach input event listener to save input on change
    liveRendering();
};
