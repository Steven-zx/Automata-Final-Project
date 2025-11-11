# Stack Coaster - AI Instructions

Interactive PDA (Pushdown Automata) visualizer with rollercoaster theme. Demonstrates formal language theory through gamified stack operations with guided simulation mode.

## Run
```powershell
Start-Process "stack-rollercoaster\src\index.html"
# Or right-click index.html → "Open with Live Server"
```

## Architecture
- **app.js** - Controller: handles input screen, manual mode, guided mode, PDA step tracking
- **stack.js** - Stack ADT (capacity=5)
- **audio.js** - Web Audio API synth (ding/whoosh/error)
- **styles.css** - All styling (input screen, main scene, PDA panel)
- **dom.js, animations.js, utils.js** - UNUSED LEGACY FILES (ignore these)

## User Flow
1. **Input Screen** → User enters PDA input string (e.g., "aabb")
2. **Main Scene** → Interactive rollercoaster with manual or guided mode
3. **Guided Mode** → Auto-simulates PDA transitions with live step tracking
4. **PDA Panel** → Shows transition function table (state, input, stack, action)

## Critical Patterns

### Animation Timing
```javascript
let busy = false; // MUST gate all operations
top.classList.add('exit-anim');
await wait(1100); // MUST wait full 1.1s before DOM removal
top.remove();
```

### PDA Guided Mode
```javascript
// Auto-simulates input string character by character
// Logs each step: (state, inputLeft, stackTop, action)
// Highlights current step in PDA panel
logPDAStep(stepNum, 'q₀', inputRemaining, 'X', 'Push X');
await addPassenger(); // Animated push
await wait(800); // Pacing between steps
```

### State Management
```javascript
let isGuidedMode = false; // Disables manual buttons during guided run
let pdaStepLog = []; // Array of {step, state, inputLeft, stackTop, action}
let currentStepIndex = 0; // For highlighting active step
let inputString = ''; // Original input from input screen
```

### Required DOM IDs
**Input Screen**: `#inputScreen`, `#pdaInput`, `#startRide`  
**Main Scene**: `#stackContainer`, `#sequenceDisplay`, `#addBtn`, `#removeBtn`, `#statusText`, `#count`, `#guidedBtn`, `#resetBtn`  
**PDA Panel**: `#pdaPanel`, `#pdaSteps`, `#closePdaPanel`

## Rules
1. All state changes in `app.js` - never modify legacy files
2. Wait for `exit-anim` (1.1s) before removing DOM elements
3. `busy` flag prevents animation conflicts - don't remove it
4. Stack capacity hardcoded to 5 in `new Stack(5)`
5. Input screen filters to only 'a' and 'b' characters
6. Guided mode disables manual controls until completion
7. PDA panel auto-opens during guided mode
8. Current step highlighted with `.current-step` class

## PDA Transition Logic
- **'a' input** → Push X onto stack (state q₀ → q₀)
- **'b' input** → Pop X from stack (state q₀ → q₀)
- **Accept** → Empty stack at end of input (state qₐ)
- **Reject** → Non-empty stack or pop on empty (state qᵣ)

## Keyboard Shortcuts
- **'a'** - Manual push (disabled in guided mode)
- **'b'** - Manual pop (disabled in guided mode)
- **'c'** - Clear sequence display
- **'r'** - Reset ride (clear stack and steps)
