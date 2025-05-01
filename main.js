const notas = [
  { nota: "C4", freq: 261.63 },
  { nota: "C#4", freq: 277.18 },
  { nota: "D4", freq: 293.66 },
  { nota: "D#4", freq: 311.13 },
  { nota: "E4", freq: 329.63 },
  { nota: "F4", freq: 349.23 },
  { nota: "F#4", freq: 369.99 },
  { nota: "G4", freq: 392.00 },
  { nota: "G#4", freq: 415.30 },
  { nota: "A4", freq: 440.00 },
  { nota: "A#4", freq: 466.16 },
  { nota: "B4", freq: 493.88 },
  { nota: "C5", freq: 523.25 }
];

const blancas = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const negras = [
  { nota: "C#4", pos: 1 },
  { nota: "D#4", pos: 2 },
  { nota: "F#4", pos: 4 },
  { nota: "G#4", pos: 5 },
  { nota: "A#4", pos: 6 }
];

const AudioContext = window.AudioContext || window.webkitAudioContext;
const ac = new AudioContext();

function playTone(frequency, duration = 1) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

function crearTeclado() {
  const contenedor = document.getElementById("keyboard");

  blancas.forEach(nota => {
    const el = document.createElement("div");
    el.className = "white";
    el.onclick = () => {
      const freq = notas.find(n => n.nota === nota).freq;
      playTone(freq);
    };
    contenedor.appendChild(el);
  });

  negras.forEach(({ nota, pos }) => {
    const el = document.createElement("div");
    el.className = "black";
    el.style.left = `${pos * 40 - 12.5}px`;
    el.onclick = () => {
      const freq = notas.find(n => n.nota === nota).freq;
      playTone(freq);
    };
    contenedor.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", crearTeclado);