const notas = [
  { nombre: "Do", freq: 261.63 },
  { nombre: "Do#", freq: 277.18 },
  { nombre: "Re", freq: 293.66 },
  { nombre: "Re#", freq: 311.13 },
  { nombre: "Mi", freq: 329.63 },
  { nombre: "Fa", freq: 349.23 },
  { nombre: "Fa#", freq: 369.99 },
  { nombre: "Sol", freq: 392.00 },
  { nombre: "Sol#", freq: 415.30 },
  { nombre: "La", freq: 440.00 },
  { nombre: "La#", freq: 466.16 },
  { nombre: "Si", freq: 493.88 }
];

let serie = [];
let respuesta = [];

const ac = new (window.AudioContext || window.webkitAudioContext)();

function reproducirNota(freq, dur = 0.6, t = 0) {
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
  const nivel = parseInt(document.getElementById("nivel").value);
  respuesta = [];
  serie = [...notas].sort(() => Math.random() - 0.5).slice(0, nivel);

  for (let i = 0; i < serie.length; i++) {
    reproducirNota(serie[i].freq, 0.6, i * 0.7);
  }

  document.getElementById("respuesta").textContent = "Introduce el orden:";
  document.getElementById("resultado").textContent = "";

  // Limpiar feedback de botones
  document.querySelectorAll('#botonera button').forEach(btn =>
    btn.classList.remove('correct', 'incorrect')
  );
}

function crearBotones() {
  const contenedor = document.getElementById("botonera");
  contenedor.innerHTML = "";

  notas.forEach(nota => {
    const btn = document.createElement("button");
    btn.textContent = nota.nombre;
    btn.onclick = () => {
      const nivel = parseInt(document.getElementById("nivel").value);
      if (respuesta.length >= nivel) return;

      respuesta.push(nota.nombre);
      actualizarRespuesta();

      const index = respuesta.length - 1;
      const esperado = serie[index].nombre;
      if (nota.nombre === esperado) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("incorrect");
      }

      if (respuesta.length === nivel) {
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