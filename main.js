const notas = [
  { id: "C4", texto: "Do", freq: 261.63 },
  { id: "C#4", texto: "Do♯<br>Re♭", freq: 277.18 },
  { id: "D4", texto: "Re", freq: 293.66 },
  { id: "D#4", texto: "Re♯<br>Mi♭", freq: 311.13 },
  { id: "E4", texto: "Mi", freq: 329.63 },
  { id: "F4", texto: "Fa", freq: 349.23 },
  { id: "F#4", texto: "Fa♯<br>Sol♭", freq: 369.99 },
  { id: "G4", texto: "Sol", freq: 392.00 },
  { id: "G#4", texto: "Sol♯<br>La♭", freq: 415.30 },
  { id: "A4", texto: "La", freq: 440.00 },
  { id: "A#4", texto: "La♯<br>Si♭", freq: 466.16 },
  { id: "B4", texto: "Si", freq: 493.88 }
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

  // Reset estilos
  document.querySelectorAll('#botonera button').forEach(btn =>
    btn.classList.remove('correct', 'incorrect')
  );
}

function crearBotones() {
  const contenedor = document.getElementById("botonera");
  contenedor.innerHTML = "";

  notas.forEach(nota => {
    const btn = document.createElement("button");
    btn.innerHTML = nota.texto;

    btn.onclick = () => {
      const nivel = parseInt(document.getElementById("nivel").value);
      if (respuesta.length >= nivel) return;

      respuesta.push(nota.id);
      actualizarRespuesta();

      const index = respuesta.length - 1;
      const esperado = serie[index].id;
      if (nota.id === esperado) {
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
  const texto = respuesta.map(id => {
    const nota = notas.find(n => n.id === id);
    return nota ? nota.texto.replace(/<br>/g, "/") : id;
  }).join(" - ");
  document.getElementById("respuesta").textContent = "Tu respuesta: " + texto;
}

function verificar() {
  const nivel = parseInt(document.getElementById("nivel").value);
  const correcta = serie.map(n => n.id).join(",");
  const usuario = respuesta.join(",");
  const resultado = document.getElementById("resultado");

  if (usuario === correcta) {
    resultado.textContent = "¡Correcto!";
    resultado.style.color = "green";
  } else {
    const serieTexto = serie.map(n => n.texto.replace(/<br>/g, "/")).join(" - ");
    resultado.textContent = "Incorrecto. La serie era: " + serieTexto;
    resultado.style.color = "red";
  }
}

document.getElementById("start").onclick = reproducirSerie;
document.addEventListener("DOMContentLoaded", crearBotones);