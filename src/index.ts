import { Alignment, AlignmentType, Document, Packer, Paragraph, TextRun, UnderlineType } from "docx";
import { saveAs } from "file-saver";
import { parseText, ScreenPlayElements, Direction, Dialogue } from "./parser";

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

const liveRendering = (text: string) => {
  const testElement = document.getElementById("test");

  if (testElement == null) {
    return;
  }

  // Create a new paragraph element with text content
  testElement.innerHTML = "";

  // Parse text from userInput
  const elements = parseUserInput();

  // Append the paragraph to the div
  for (let i = 0; i < elements?.length; i++) {
    const element = elements[i];
    testElement.appendChild(element.getRenderedHtml());
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
  const target = event.target as HTMLInputElement;
  const text = target.value;
  liveRendering(text);
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
                id: "myWonkyStyle",
                name: "My Wonky Style",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    italics: true,
                    color: "999999",
                },
                paragraph: {
                    spacing: {
                        line: 276,
                    },
                    indent: {
                        left: 720,
                    },
                }}]
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

// generateDoc()
