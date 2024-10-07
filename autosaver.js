// Function to set a cookie
function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expiry
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}
// Function to get a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}
// Function to load saved input when the page loads
export function loadSavedInput() {
    var savedInput = getCookie('userInput'); // Get the saved input from cookies
    var inputField = document.getElementById('userInput');
    if (savedInput && inputField) {
        inputField.value = savedInput; // Set the value of textarea
    }
}
// Function to save the input on each modification
export function saveInputOnChange() {
    var inputField = document.getElementById('userInput');
    if (inputField) {
        inputField.addEventListener('input', function () {
            var userInput = inputField.value;
            setCookie('userInput', userInput, 7); // Save input in cookies for 7 days
        });
    }
}
