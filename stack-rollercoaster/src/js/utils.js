function getRandomPassengerIcon() {
    const icons = ['😊', '👦', '👧', '🧑', '👨‍🎤', '👩‍🎤'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function updateStatusMessage(message) {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.textContent = message;
}

function isValidInput(input) {
    return input.trim() !== '';
}

function resetInputField(inputField) {
    inputField.value = '';
}

export { getRandomPassengerIcon, updateStatusMessage, isValidInput, resetInputField };