import { parseText } from "./parser";
import { loadSavedInput, saveInputOnChange } from "./autosaver"
import { ScreenPlay } from "./screenplay"
import { generateDoc } from "./docGenerator"
import './styles.css';

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

    // Set window title with screenplay title
    document.title = screenplay.title.asString()

    // Append title
    liveRenderDivElement.appendChild(screenplay.title.getRenderedHtml())

    // Append authors
    liveRenderDivElement.appendChild(screenplay.authors.getRenderedHtml())

    // Append the paragraph to the div
    for (let i = 0; i < screenplay.elements?.length; i++) {
        const element = screenplay.elements[i];
        liveRenderDivElement.appendChild(element.getRenderedHtml());
    }
};

///// Plug live rendering on user input

// Get the input element by its ID
const inputElement = document.getElementById(
    "userInput"
) as HTMLTextAreaElement;

// Add an event listener to capture the input change event
inputElement.addEventListener("input", (_) => {
    liveRendering();
});


///// Plug download button

const downloadButtonCallback = () => {
    let screenplay = parseUserInput()
    generateDoc(screenplay);
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
