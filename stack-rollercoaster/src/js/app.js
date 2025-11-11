import { Stack } from './stack.js';
import { ding, whoosh, error } from './audio.js';

const statusText = document.getElementById('statusText');
const statusSub = document.getElementById('statusSub');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const stackArea = document.getElementById('stackContainer');
const count = document.getElementById('count');
const sequenceDisplay = document.getElementById('sequenceDisplay');

const stack = new Stack(5);
const colors = ['car-red', 'car-blue', 'car-green', 'car-yellow', 'car-orange'];
const faces = ['😀', '😃', '😄', '😁', '🤠', '😎', '🤗', '🥳', '🧒', '👧'];
let busy = false;
let sequence = []; // Track the PDA sequence

function updateSequenceDisplay() {
  if (sequence.length === 0) {
    sequenceDisplay.innerHTML = '<span class="sequence-label">PLEASE WAIT</span>';
  } else {
    sequenceDisplay.innerHTML = sequence.map((symbol, index) => 
      `<span class="sequence-symbol symbol-${symbol}" style="animation-delay: ${index * 0.05}s">${symbol}</span>`
    ).join('');
  }
}

function updateUI() {
  const n = stack.size();
  count.textContent = n;
  updateSequenceDisplay();
  
  if (stack.isEmpty()) {
    statusText.textContent = 'RIDE OPEN!';
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = false;
    removeBtn.disabled = true;
  } else if (n >= stack.capacity) {
    statusText.textContent = 'RIDE FULL!';
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = true;
    removeBtn.disabled = false;
  } else {
    statusText.textContent = 'BOARDING!';
    statusSub.textContent = 'PDA SEQUENCE:';
    addBtn.disabled = false;
    removeBtn.disabled = false;
  }
}

function randomColor() { return colors[Math.floor(Math.random() * colors.length)]; }
function randomFace() { return faces[Math.floor(Math.random() * faces.length)]; }

async function addPassenger() {
  if (busy || stack.size() >= stack.capacity) return;
  busy = true;
  addBtn.disabled = true;
  removeBtn.disabled = true;

  // Add 'a' to sequence
  sequence.push('a');
  updateSequenceDisplay();

  const car = document.createElement('div');
  car.className = `car ${randomColor()}`;
  car.innerHTML = `<span class="passenger">${randomFace()}</span><span class="passenger">${randomFace()}</span>`;
  
  stackArea.appendChild(car);
  ding();

  try { stack.push({ id: Date.now() }); } catch {}
  updateUI();
  busy = false;
}

async function removePassenger() {
  if (busy || stack.isEmpty()) {
    error();
    return;
  }
  busy = true;
  addBtn.disabled = true;
  removeBtn.disabled = true;
  statusText.textContent = 'EXITING!';
  statusSub.textContent = 'PDA SEQUENCE:';

  // Add 'b' to sequence
  sequence.push('b');
  updateSequenceDisplay();

  const cars = [...stackArea.querySelectorAll('.car')];
  const top = cars[cars.length - 1];
  
  if (top) {
    top.classList.add('exit-anim');
    whoosh();
    await wait(1100);
    top.remove();
  }

  try { stack.pop(); } catch {}
  updateUI();
  busy = false;
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

addBtn.addEventListener('click', addPassenger);
removeBtn.addEventListener('click', removePassenger);

// Double-click sequence display to clear it
sequenceDisplay.addEventListener('dblclick', () => {
  sequence = [];
  updateSequenceDisplay();
  ding();
});

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'a') { e.preventDefault(); addPassenger(); }
  if (e.key.toLowerCase() === 'b') { e.preventDefault(); removePassenger(); }
  if (e.key.toLowerCase() === 'c') { e.preventDefault(); sequence = []; updateSequenceDisplay(); ding(); }
});

updateUI();
