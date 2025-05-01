let ac;
let piano;

const whiteKeys = [
  { note: "C4" }, { note: "D4" }, { note: "E4" },
  { note: "F4" }, { note: "G4" }, { note: "A4" },
  { note: "B4" }, { note: "C5" }
];

const blackKeys = [
  { note: "C#4", position: 1 },
  { note: "D#4", position: 2 },
  { note: "F#4", position: 4 },
  { note: "G#4", position: 5 },
  { note: "A#4", position: 6 }
];

async function initAudio() {
  if (!ac) {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    piano = await Soundfont.instrument(ac, 'acoustic_grand_piano');
  }
}

function playNote(note) {
  initAudio().then(() => {
    piano.play(note);
  });
}

function crearTeclado() {
  const contenedor = document.getElementById("keyboard");

  whiteKeys.forEach((key, i) => {
    const el = document.createElement("div");
    el.className = "white";
    el.addEventListener("click", () => playNote(key.note));
    contenedor.appendChild(el);
  });

  blackKeys.forEach(key => {
    const el = document.createElement("div");
    el.className = "black";
    el.style.left = `${key.position * 40 - 12.5}px`;
    el.addEventListener("click", () => playNote(key.note));
    contenedor.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", crearTeclado);