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

const liveRendering = () => {
    // Get the input element by its ID
    const inputElement = document.getElementById(
      "userInput"
    ) as HTMLTextAreaElement;

    const text = inputElement.value


    // Get the preview text area
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

// generateDoc()


//// Cookies / Auto save

// Function to set a cookie
function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expiry
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Function to get a cookie by name
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

// Function to load saved input when the page loads
function loadSavedInput(): void {
  const savedInput = getCookie('userInput'); // Get the saved input from cookies
  const inputField = document.getElementById('userInput') as HTMLTextAreaElement;
  if (savedInput && inputField) {
    inputField.value = savedInput; // Set the value of textarea
  }
}

// Function to save the input on each modification
function saveInputOnChange(): void {
  const inputField = document.getElementById('userInput') as HTMLTextAreaElement;
  if (inputField) {
    inputField.addEventListener('input', () => {
      const userInput = inputField.value;
      setCookie('userInput', userInput, 7); // Save input in cookies for 7 days
    });
  }
}

// Run these functions when the page loads
window.onload = function (): void {
  loadSavedInput(); // Load saved input from cookies
  saveInputOnChange(); // Attach input event listener to save input on change
    liveRendering();
};
