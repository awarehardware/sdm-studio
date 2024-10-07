import { parseText } from "./parser";
import { loadSavedInput, saveInputOnChange } from "./autosaver";
import { generateDoc } from "./docGenerator";
import './styles.css';
var parseUserInput = function () {
    var userInput = document.getElementById("userInput");
    // Parse text
    if (userInput.value) {
        return parseText(userInput.value);
    }
    else {
        return parseText("");
    }
};
var liveRendering = function () {
    var _a;
    // Get the preview text area
    var liveRenderDivElement = document.getElementById("liveRenderDiv");
    if (liveRenderDivElement == null) {
        return;
    }
    // Create a new paragraph element with text content
    liveRenderDivElement.innerHTML = "";
    // Parse text from userInput
    var screenplay = parseUserInput();
    // Set window title with screenplay title
    document.title = screenplay.title.asString();
    // Append stage
    liveRenderDivElement.appendChild(screenplay.stage.getRenderedHtml());
    // Append title
    liveRenderDivElement.appendChild(screenplay.title.getRenderedHtml());
    // Append authors
    liveRenderDivElement.appendChild(screenplay.authors.getRenderedHtml());
    // Append the paragraph to the div
    for (var i = 0; i < ((_a = screenplay.elements) === null || _a === void 0 ? void 0 : _a.length); i++) {
        var element = screenplay.elements[i];
        liveRenderDivElement.appendChild(element.getRenderedHtml());
    }
};
///// Plug live rendering on user input
// Get the input element by its ID
var inputElement = document.getElementById("userInput");
// Add an event listener to capture the input change event
inputElement.addEventListener("input", function (_) {
    liveRendering();
});
///// Plug download button
var downloadButtonCallback = function () {
    var screenplay = parseUserInput();
    generateDoc(screenplay);
};
var downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadButtonCallback);
///// Run these functions when the page loads
window.onload = function () {
    loadSavedInput(); // Load saved input from cookies
    saveInputOnChange(); // Attach input event listener to save input on change
    liveRendering();
};
