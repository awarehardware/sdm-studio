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
export function loadSavedInput(): void {
  const savedInput = getCookie('userInput'); // Get the saved input from cookies
  const inputField = document.getElementById('userInput') as HTMLTextAreaElement;
  if (savedInput && inputField) {
    inputField.value = savedInput; // Set the value of textarea
  }
}

// Function to save the input on each modification
export function saveInputOnChange(): void {
  const inputField = document.getElementById('userInput') as HTMLTextAreaElement;
  if (inputField) {
    inputField.addEventListener('input', () => {
      const userInput = inputField.value;
      setCookie('userInput', userInput, 7); // Save input in cookies for 7 days
    });
  }
}

