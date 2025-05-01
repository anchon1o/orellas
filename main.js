const ac = new AudioContext();
let player;
let melodia = [];
let respuesta = [];

const notasDisponibles = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const tempo = 80;
const duracionNota = 60 / tempo;

const selectNotas = document.getElementById("noteCount");
const selectInstrumento = document.getElementById("instrument");
const btnGenerar = document.getElementById("generate");
const btnRepetir = document.getElementById("replay");
const feedback = document.getElementById("feedback");

async function cargarInstrumento(nombre = "acoustic_grand_piano") {
  player = await Soundfont.instrument(ac, nombre);
}

function generarMelodia(numNotas) {
  const resultado = [];
  for (let i = 0; i < numNotas; i++) {
    const nota = notasDisponibles[Math.floor(Math.random() * notasDisponibles.length)];
    resultado.push(nota);
  }
  return resultado;
}

function reproducirMelodia(melodia) {
  let t = ac.currentTime;
  melodia.forEach(nota => {
    player.play(nota, t, { duration: duracionNota });
    t += duracionNota;
  });
}

function crearTeclado() {
  const contenedor = document.getElementById("keyboard");
  contenedor.innerHTML = "";
  notasDisponibles.forEach(nota => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = nota;
    btn.onclick = () => {
      respuesta.push(nota);
      if (respuesta.length === melodia.length) {
        comprobarRespuesta();
      }
    };
    contenedor.appendChild(btn);
  });
}

function comprobarRespuesta() {
  if (respuesta.join() === melodia.join()) {
    feedback.textContent = "¡Correcto!";
    feedback.className = "correct";
  } else {
    feedback.textContent = "Incorrecto. La melodía era: " + melodia.join(" ");
    feedback.className = "incorrect";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarInstrumento();
  crearTeclado();

  selectInstrumento.onchange = async () => {
    const nombre = selectInstrumento.value;
    await cargarInstrumento(nombre);
  };

  btnGenerar.onclick = async () => {
    melodia = generarMelodia(parseInt(selectNotas.value));
    respuesta = [];
    feedback.textContent = "";
    reproducirMelodia(melodia);
    btnRepetir.disabled = false;
  };

  btnRepetir.onclick = () => {
    reproducirMelodia(melodia);
  };
});
