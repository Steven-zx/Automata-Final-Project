import { Stack } from './stack.js';
import { ding, whoosh, error } from './audio.js';

const statusText = document.getElementById('statusText');
const statusSub = document.getElementById('statusSub');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const stackArea = document.getElementById('stackContainer');
const count = document.getElementById('count');
const capacityBar = document.getElementById('capacityBar');

const stack = new Stack(5);
const colors = ['car-red', 'car-blue', 'car-green', 'car-yellow', 'car-orange'];
const faces = ['😀', '😃', '😄', '😁', '🤠', '😎', '🤗', '🥳', '🧒', '👧'];
let busy = false;

function updateUI() {
  const n = stack.size();
  count.textContent = n;
  capacityBar.style.width = `${(n / stack.capacity) * 100}%`;
  
  if (stack.isEmpty()) {
    statusText.textContent = 'RIDE OPEN!';
    statusSub.textContent = 'AWAITING NEW PASSENGERS';
    addBtn.disabled = false;
    removeBtn.disabled = true;
  } else if (n >= stack.capacity) {
    statusText.textContent = 'RIDE FULL!';
    statusSub.textContent = 'PLEASE WAIT';
    addBtn.disabled = true;
    removeBtn.disabled = false;
  } else {
    statusText.textContent = 'BOARDING!';
    statusSub.textContent = `${stack.capacity - n} SEATS AVAILABLE`;
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
  statusSub.textContent = 'PASSENGER DISEMBARKING';

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
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'a') { e.preventDefault(); addPassenger(); }
  if (e.key.toLowerCase() === 'b') { e.preventDefault(); removePassenger(); }
});

updateUI();
