import { Stack } from './stack.js';
import { ding, whoosh, error } from './audio.js';

// Wait for DOM to be ready
let scene, statusText, statusSub, addBtn, removeBtn, stackArea, count, sequenceDisplay, guidedBtn, resetBtn;
let pdaPanel, closePdaPanel, pdaSteps;
let resultModal, resultIcon, resultText, resultMessage, tryAgainBtn;

// DOM Elements - Input Screen (available immediately)
const inputScreen = document.getElementById('inputScreen');
const pdaInput = document.getElementById('pdaInput');
const startRideBtn = document.getElementById('startRide');

// State
const stack = new Stack(5);
const colors = ['car-red', 'car-blue', 'car-green', 'car-yellow', 'car-orange'];
const faces = ['😀', '😃', '😄', '😁', '🤠', '😎', '🤗', '🥳', '🧒', '👧'];
let busy = false;
let sequence = [];
let inputString = '';
let pdaStepLog = [];
let isGuidedMode = false;
let currentStepIndex = 0;
let currentInputIndex = 0; // Track position in input string

function randomColor() { return colors[Math.floor(Math.random() * colors.length)]; }
function randomFace() { return faces[Math.floor(Math.random() * faces.length)]; }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// Initialize main scene elements
function initMainScene() {
  scene = document.querySelector('.scene');
  statusText = document.getElementById('statusText');
  statusSub = document.getElementById('statusSub');
  addBtn = document.getElementById('addBtn');
  removeBtn = document.getElementById('removeBtn');
  stackArea = document.getElementById('stackContainer');
  count = document.getElementById('count');
  sequenceDisplay = document.getElementById('sequenceDisplay');
  guidedBtn = document.getElementById('guidedBtn');
  resetBtn = document.getElementById('resetBtn');
  pdaPanel = document.getElementById('pdaPanel');
  closePdaPanel = document.getElementById('closePdaPanel');
  pdaSteps = document.getElementById('pdaSteps');
  resultModal = document.getElementById('resultModal');
  resultIcon = document.getElementById('resultIcon');
  resultText = document.getElementById('resultText');
  resultMessage = document.getElementById('resultMessage');
  tryAgainBtn = document.getElementById('tryAgainBtn');
  
  // Set up event listeners
  addBtn.addEventListener('click', addPassenger);
  removeBtn.addEventListener('click', removePassenger);
  guidedBtn.addEventListener('click', startGuidedMode);
  resetBtn.addEventListener('click', resetRide);
  closePdaPanel.addEventListener('click', () => pdaPanel.classList.remove('active'));
  tryAgainBtn.addEventListener('click', () => {
    resultModal.classList.remove('show');
    goBackToInput();
  });
  
  sequenceDisplay.addEventListener('dblclick', () => {
    if (!isGuidedMode) {
      sequence = [];
      updateSequenceDisplay();
      ding();
    }
  });
  
  document.addEventListener('keydown', e => {
    // In guided mode, allow a/b keys to work
    if (e.key.toLowerCase() === 'a') { e.preventDefault(); addPassenger(); }
    if (e.key.toLowerCase() === 'b') { e.preventDefault(); removePassenger(); }
    if (e.key.toLowerCase() === 'c' && !isGuidedMode) { e.preventDefault(); sequence = []; updateSequenceDisplay(); ding(); }
    if (e.key.toLowerCase() === 'r' && !isGuidedMode) { e.preventDefault(); resetRide(); }
  });
  
  updateUI();
}

// Input Screen Logic
pdaInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.toLowerCase().replace(/[^ab]/g, '');
});

startRideBtn.addEventListener('click', () => {
  const input = pdaInput.value.trim();
  if (!input) {
    pdaInput.style.borderColor = '#ef4444';
    pdaInput.placeholder = 'Please enter at least one character!';
    setTimeout(() => {
      pdaInput.style.borderColor = '#7c3aed';
      pdaInput.placeholder = 'e.g. aabb, aaabbb';
    }, 2000);
    return;
  }
  
  inputString = input;
  inputScreen.style.animation = 'fadeOut 0.5s ease';
  setTimeout(() => {
    inputScreen.style.display = 'none';
    const sceneElem = document.querySelector('.scene');
    sceneElem.style.display = 'flex';
    sceneElem.style.animation = 'fadeIn 0.5s ease';
    initMainScene(); // Initialize after scene is visible
    ding();
    
    // Automatically start guided mode
    setTimeout(() => {
      startGuidedMode();
    }, 500);
  }, 500);
});

// Sequence Display
function updateSequenceDisplay() {
  // In guided mode, always show input string with highlighting
  if (isGuidedMode) {
    sequenceDisplay.innerHTML = inputString.split('').map((char, idx) => {
      if (idx === currentInputIndex) {
        return `<span class="sequence-symbol symbol-${char} highlight-current">${char}</span>`;
      } else if (idx < currentInputIndex) {
        return `<span class="sequence-symbol symbol-${char} completed">${char}</span>`;
      }
      return `<span class="sequence-symbol symbol-${char}">${char}</span>`;
    }).join('');
  } else if (sequence.length === 0) {
    sequenceDisplay.innerHTML = `<span class="sequence-label">INPUT: ${inputString}</span>`;
  } else {
    sequenceDisplay.innerHTML = sequence.map((symbol, index) => 
      `<span class="sequence-symbol symbol-${symbol}" style="animation-delay: ${index * 0.05}s">${symbol}</span>`
    ).join('');
  }
}

// UI Updates
function updateUI() {
  const n = stack.size();
  count.textContent = n;
  updateSequenceDisplay();
  
  if (stack.isEmpty()) {
    if (!isGuidedMode) {
      statusText.textContent = 'RIDE OPEN!';
    }
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = false;
    removeBtn.disabled = true;
  } else if (n >= stack.capacity) {
    if (!isGuidedMode) {
      statusText.textContent = 'RIDE FULL!';
    }
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = true;
    removeBtn.disabled = false;
  } else {
    if (!isGuidedMode) {
      statusText.textContent = 'BOARDING!';
    }
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = false;
    removeBtn.disabled = false;
  }
}

// Manual Operations (now works with guided mode)
async function addPassenger() {
  if (busy || stack.size() >= stack.capacity) return;
  
  // In guided mode, check if 'a' is the expected input
  if (isGuidedMode) {
    if (currentInputIndex >= inputString.length) {
      error();
      return;
    }
    if (inputString[currentInputIndex] !== 'a') {
      error();
      statusText.textContent = `❌ Wrong key! Expected '${inputString[currentInputIndex]}'`;
      return;
    }
  }
  
  busy = true;
  addBtn.disabled = true;
  removeBtn.disabled = true;

  sequence.push('a');
  
  // Log PDA step if in guided mode
  if (isGuidedMode) {
    const inputRemaining = inputString.substring(currentInputIndex + 1);
    const stackTop = stack.isEmpty() ? 'Z₀' : 'X';
    logPDAStep(currentInputIndex + 1, 'q₀', inputRemaining, stackTop, 'Push X');
    currentStepIndex++;
    renderPDASteps();
    currentInputIndex++;
  }

  const car = document.createElement('div');
  car.className = `car ${randomColor()}`;
  car.innerHTML = `<span class="passenger">${randomFace()}</span><span class="passenger">${randomFace()}</span>`;
  
  stackArea.appendChild(car);
  ding();

  try { stack.push({ id: Date.now() }); } catch {}
  
  // Check if input is complete
  if (isGuidedMode && currentInputIndex >= inputString.length) {
    await wait(500);
    checkFinalState();
  }
  
  updateUI();
  busy = false;
}

async function removePassenger() {
  if (busy || stack.isEmpty()) {
    error();
    return;
  }
  
  // In guided mode, check if 'b' is the expected input
  if (isGuidedMode) {
    if (currentInputIndex >= inputString.length) {
      error();
      return;
    }
    if (inputString[currentInputIndex] !== 'b') {
      error();
      statusText.textContent = `❌ Wrong key! Expected '${inputString[currentInputIndex]}'`;
      return;
    }
  }
  
  busy = true;
  addBtn.disabled = true;
  removeBtn.disabled = true;
  statusText.textContent = 'EXITING!';
  statusSub.textContent = 'PDA SEQUENCE:';

  sequence.push('b');
  
  // Log PDA step if in guided mode
  if (isGuidedMode) {
    const inputRemaining = inputString.substring(currentInputIndex + 1);
    logPDAStep(currentInputIndex + 1, 'q₀', inputRemaining, 'X', 'Pop X');
    currentStepIndex++;
    renderPDASteps();
    currentInputIndex++;
  }

  const cars = [...stackArea.querySelectorAll('.car')];
  const top = cars[cars.length - 1];
  
  if (top) {
    top.classList.add('exit-anim');
    whoosh();
    await wait(1100);
    top.remove();
  }

  try { stack.pop(); } catch {}
  
  // Check if input is complete
  if (isGuidedMode && currentInputIndex >= inputString.length) {
    await wait(500);
    checkFinalState();
  }
  
  updateUI();
  busy = false;
}

// PDA Step Logging
function logPDAStep(step, state, inputLeft, stackTop, action) {
  pdaStepLog.push({ step, state, inputLeft, stackTop, action });
  renderPDASteps();
}

function renderPDASteps() {
  if (pdaStepLog.length === 0) {
    pdaSteps.innerHTML = '<tr class="empty-state"><td colspan="5">No steps yet. Start guided mode!</td></tr>';
    return;
  }
  
  pdaSteps.innerHTML = pdaStepLog.map((log, idx) => `
    <tr class="${idx === currentStepIndex - 1 ? 'current-step' : ''}">
      <td>${log.step}</td>
      <td>${log.state}</td>
      <td>${log.inputLeft || 'ε'}</td>
      <td>${log.stackTop || 'Z₀'}</td>
      <td>${log.action}</td>
    </tr>
  `).join('');
}

// Guided Mode - Start step-by-step input
function startGuidedMode() {
  if (busy || isGuidedMode || !inputString) return;
  
  isGuidedMode = true;
  guidedBtn.disabled = true;
  
  // Reset state
  sequence = [];
  currentStepIndex = 0;
  currentInputIndex = 0;
  pdaStepLog = [];
  pdaPanel.classList.add('active');
  
  statusText.textContent = '🎯 GUIDED MODE';
  statusSub.textContent = `Press the keys: ${inputString}`;
  
  // Initial state
  logPDAStep(0, 'q₀', inputString, 'Z₀', 'Start - Follow the highlighted input!');
  currentStepIndex++;
  renderPDASteps();
  
  updateUI();
}

// Check final state after all input is processed
function checkFinalState() {
  const stepNum = currentInputIndex + 1;
  
  if (stack.isEmpty()) {
    logPDAStep(stepNum, 'qₐ', 'ε', 'Z₀', '✅ ACCEPT');
    statusText.textContent = '✅ ACCEPTED!';
    statusSub.textContent = 'Valid PDA sequence!';
    currentStepIndex++;
    renderPDASteps();
    ding();
    
    // Show result modal
    setTimeout(() => {
      showResultModal(true);
    }, 800);
  } else {
    logPDAStep(stepNum, 'qᵣ', 'ε', 'X', '❌ REJECT (Stack not empty)');
    statusText.textContent = '❌ REJECTED!';
    statusSub.textContent = 'Stack not empty!';
    currentStepIndex++;
    renderPDASteps();
    error();
    
    // Show result modal
    setTimeout(() => {
      showResultModal(false);
    }, 800);
  }
  
  isGuidedMode = false;
  guidedBtn.disabled = false;
}

// Show result modal
function showResultModal(accepted) {
  const content = resultModal.querySelector('.result-content');
  
  if (accepted) {
    resultIcon.textContent = '✅';
    resultText.textContent = 'ACCEPTED!';
    resultText.className = 'result-text accepted';
    resultMessage.textContent = 'Your input string is valid! The stack is empty.';
    content.className = 'result-content accepted';
  } else {
    resultIcon.textContent = '❌';
    resultText.textContent = 'REJECTED!';
    resultText.className = 'result-text rejected';
    resultMessage.textContent = 'Invalid input! The stack is not empty.';
    content.className = 'result-content rejected';
  }
  
  resultModal.classList.add('show');
}

// Go back to input screen
function goBackToInput() {
  // Reset everything
  stackArea.innerHTML = '';
  stack._data = [];
  sequence = [];
  pdaStepLog = [];
  currentStepIndex = 0;
  currentInputIndex = 0;
  isGuidedMode = false;
  pdaPanel.classList.remove('active');
  
  // Hide scene, show input screen
  scene.style.animation = 'fadeOut 0.5s ease';
  setTimeout(() => {
    scene.style.display = 'none';
    inputScreen.style.display = 'flex';
    inputScreen.style.animation = 'fadeIn 0.5s ease';
    pdaInput.value = '';
    pdaInput.focus();
  }, 500);
}

// Reset
function resetRide() {
  if (busy) return;
  
  // Clear stack visually
  stackArea.innerHTML = '';
  
  // Reset state
  stack._data = [];
  sequence = [];
  pdaStepLog = [];
  currentStepIndex = 0;
  currentInputIndex = 0;
  isGuidedMode = false;
  
  // Reset UI
  pdaPanel.classList.remove('active');
  renderPDASteps();
  updateUI();
  ding();
}
