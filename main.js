const notas = [
  "C4", "C#4", "D4", "D#4", "E4",
  "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"
];

const blancas = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const negras = [
  { nota: "C#4", pos: 1 },
  { nota: "D#4", pos: 2 },
  { nota: "F#4", pos: 4 },
  { nota: "G#4", pos: 5 },
  { nota: "A#4", pos: 6 }
];

function reproducirNota(nota) {
  const url = `https://ffont.github.io/AudioKeys/audio/${nota}.mp3`;
  const audio = new Audio(url);
  audio.play();
}

function crearTeclado() {
  const contenedor = document.getElementById("keyboard");

  blancas.forEach(nota => {
    const el = document.createElement("div");
    el.className = "white";
    el.onclick = () => reproducirNota(nota);
    contenedor.appendChild(el);
  });

  negras.forEach(({ nota, pos }) => {
    const el = document.createElement("div");
    el.className = "black";
    el.style.left = `${pos * 40 - 12.5}px`;
    el.onclick = () => reproducirNota(nota);
    contenedor.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", crearTeclado);