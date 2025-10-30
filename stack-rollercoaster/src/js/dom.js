// This file handles DOM manipulation, creating and removing rollercoaster car elements and passenger icons based on stack operations, and updating the status messages displayed to the user.

const stackContainer = document.getElementById('stack-container');
const statusDisplay = document.getElementById('status-display');
const capacityIndicator = document.getElementById('capacity-indicator');

function createCar(passenger) {
    const car = document.createElement('div');
    car.className = 'rollercoaster-car';
    const passengerIcon = document.createElement('div');
    passengerIcon.className = 'passenger-icon';
    passengerIcon.innerText = passenger;
    car.appendChild(passengerIcon);
    return car;
}

function addCarToStack(passenger) {
    const car = createCar(passenger);
    stackContainer.appendChild(car);
    updateStatus(`Boarding ${passenger}!`);
}

function removeCarFromStack() {
    if (stackContainer.lastChild) {
        const car = stackContainer.lastChild;
        car.classList.add('exit-animation');
        setTimeout(() => {
            stackContainer.removeChild(car);
            updateStatus('Exiting passenger!');
        }, 500); // Adjust time to match exit animation duration
    } else {
        updateStatus('No passengers to remove!');
    }
}

function updateStatus(message) {
    statusDisplay.innerText = message;
}

function updateCapacityIndicator(current, max) {
    capacityIndicator.innerText = `${current} / ${max}`;
}

// Export functions for use in other modules
export { addCarToStack, removeCarFromStack, updateStatus, updateCapacityIndicator };