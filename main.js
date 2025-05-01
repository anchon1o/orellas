const notas = [
  { nombre: "C4", freq: 261.63 },
  { nombre: "C#4", freq: 277.18 },
  { nombre: "D4", freq: 293.66 },
  { nombre: "D#4", freq: 311.13 },
  { nombre: "E4", freq: 329.63 },
  { nombre: "F4", freq: 349.23 },
  { nombre: "F#4", freq: 369.99 },
  { nombre: "G4", freq: 392.00 },
  { nombre: "G#4", freq: 415.30 },
  { nombre: "A4", freq: 440.00 },
  { nombre: "A#4", freq: 466.16 },
  { nombre: "B4", freq: 493.88 }
];

let serie = [];
let respuesta = [];

const ac = new (window.AudioContext || window.webkitAudioContext)();

function reproducirNota(freq, dur = 0.7, t = 0) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + t);
  osc.stop(ac.currentTime + t + dur);
}

function reproducirSerie() {
  respuesta = [];
  serie = [...notas].sort(() => Math.random() - 0.5);
  for (let i = 0; i < serie.length; i++) {
    reproducirNota(serie[i].freq, 0.6, i * 0.7);
  }
  document.getElementById("respuesta").textContent = "Introduce el orden:";
  document.getElementById("resultado").textContent = "";
}

function crearBotones() {
  const contenedor = document.getElementById("botonera");
  contenedor.innerHTML = "";

  notas.forEach(nota => {
    const btn = document.createElement("button");
    btn.textContent = nota.nombre;
    btn.onclick = () => {
      respuesta.push(nota.nombre);
      actualizarRespuesta();
      if (respuesta.length === 12) {
        verificar();
      }
    };
    contenedor.appendChild(btn);
  });
}

function actualizarRespuesta() {
  document.getElementById("respuesta").textContent =
    "Tu respuesta: " + respuesta.join(" - ");
}

function verificar() {
  const correcta = serie.map(n => n.nombre).join(",");
  const usuario = respuesta.join(",");
  const resultado = document.getElementById("resultado");

  if (usuario === correcta) {
    resultado.textContent = "¡Correcto!";
    resultado.style.color = "green";
  } else {
    resultado.textContent = "Incorrecto. La serie era: " + correcta;
    resultado.style.color = "red";
  }
}

document.getElementById("start").onclick = reproducirSerie;
document.addEventListener("DOMContentLoaded", crearBotones);