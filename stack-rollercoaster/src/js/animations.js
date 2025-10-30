// This file controls the triggering of CSS animations programmatically based on stack state changes, ensuring smooth transitions during push and pop operations.

const animations = {
    pushAnimation: function(carElement) {
        carElement.classList.add('slide-in');
        carElement.addEventListener('animationend', () => {
            carElement.classList.remove('slide-in');
        });
    },

    popAnimation: function(carElement, exitRamp) {
        carElement.classList.add('slide-out');
        carElement.addEventListener('animationend', () => {
            carElement.classList.remove('slide-out');
            exitRamp.appendChild(carElement);
        });
    },

    errorAnimation: function(messageElement) {
        messageElement.classList.add('error-flash');
        messageElement.addEventListener('animationend', () => {
            messageElement.classList.remove('error-flash');
        });
    },

    rideFullAnimation: function(entryGate) {
        entryGate.classList.add('ride-full');
        entryGate.addEventListener('animationend', () => {
            entryGate.classList.remove('ride-full');
        });
    },

    rideOpenAnimation: function(entryGate) {
        entryGate.classList.add('ride-open');
        entryGate.addEventListener('animationend', () => {
            entryGate.classList.remove('ride-open');
        });
    }
};

export default animations;