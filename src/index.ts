import { Alignment, AlignmentType, Document, Packer, Paragraph, TextRun, UnderlineType } from "docx";
import { saveAs } from "file-saver";
import { parseText, ScreenPlayElements, Direction, Dialogue } from "./parser";
import { loadSavedInput, saveInputOnChange } from "./autosaver"
import './styles.css';

// Your TypeScript code

const parseUserInput = (): ScreenPlayElements[] => {
    const userInput = document.getElementById("userInput") as HTMLTextAreaElement;
    console.log(userInput);
    // Parse text
    if (userInput.value) {
        console.log(userInput.value);
        return parseText(userInput.value);
    } else {
        return [];
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
    const elements = parseUserInput();

    // Append the paragraph to the div
    for (let i = 0; i < elements?.length; i++) {
        const element = elements[i];
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
inputElement.addEventListener("input", (event) => {
    liveRendering();
});

///

async function generateDoc() {
    // Get the text from the input field
    const section_children = [];
    const elements = parseUserInput();

    for (let i = 0; i < elements.length; i++) {
        section_children.push(...elements[i].getRenderedDocxParagraph());
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
                        size: "26pt"
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
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
                        size: "26pt"
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
                        size: "26pt"
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
    console.log("hello");
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
