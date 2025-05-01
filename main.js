const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextFunc();
const player = new WebAudioFontPlayer();
let instrument;

player.loader.startLoad(audioContext, "_tone_0000_Aspirin_sf2_file.js", "_tone_0000_Aspirin_sf2_file");
player.loader.onload = () => {
  instrument = player.loader.instrument("_tone_0000_Aspirin_sf2_file");
};

function playNote(note) {
  const midi = notaAMidi(note);
  player.queueWaveTable(audioContext, audioContext.destination, instrument, audioContext.currentTime, midi, 1.5);
}

function notaAMidi(nota) {
  const mapa = {
    C: 0, Cs: 1, D: 2, Ds: 3, E: 4,
    F: 5, Fs: 6, G: 7, Gs: 8, A: 9, As: 10, B: 11
  };
  const letra = nota[0];
  const sostenido = nota[1] === '#' || nota[1] === 's';
  const octava = parseInt(nota[sostenido ? 2 : 1]);
  const clave = sostenido ? letra + 's' : letra;
  return 12 * (octava + 1) + mapa[clave];
}

function crearTeclado() {
  const contenedor = document.getElementById("keyboard");

  const blancas = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  const negras = [
    { nota: "C#4", pos: 1 },
    { nota: "D#4", pos: 2 },
    { nota: "F#4", pos: 4 },
    { nota: "G#4", pos: 5 },
    { nota: "A#4", pos: 6 }
  ];

  blancas.forEach(nota => {
    const el = document.createElement("div");
    el.className = "white";
    el.onclick = () => playNote(nota);
    contenedor.appendChild(el);
  });

  negras.forEach(({ nota, pos }) => {
    const el = document.createElement("div");
    el.className = "black";
    el.style.left = `${pos * 40 - 12.5}px`;
    el.onclick = () => playNote(nota);
    contenedor.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", crearTeclado);