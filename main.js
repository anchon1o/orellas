const notasNaturales = [
  { id: "C4", texto: "Do", freq: 261.63 },
  { id: "D4", texto: "Re", freq: 293.66 },
  { id: "E4", texto: "Mi", freq: 329.63 },
  { id: "F4", texto: "Fa", freq: 349.23 },
  { id: "G4", texto: "Sol", freq: 392.00 },
  { id: "A4", texto: "La", freq: 440.00 },
  { id: "B4", texto: "Si", freq: 493.88 }
];

const notasAlteradas = [
  { id: "C#4", texto: "Do♯<br>Re♭", freq: 277.18 },
  { id: "D#4", texto: "Re♯<br>Mi♭", freq: 311.13 },
  { espacio: true },
  { id: "F#4", texto: "Fa♯<br>Sol♭", freq: 369.99 },
  { id: "G#4", texto: "Sol♯<br>La♭", freq: 415.30 },
  { id: "A#4", texto: "La♯<br>Si♭", freq: 466.16 }
];

const todasLasNotas = [...notasNaturales, ...notasAlteradas.filter(n => n.id)];

let serie = [];
let respuesta = [];
let osciladoresActivos = [];
let puntuacionTotal = 0;
let rachaPerfecta = 0;

const ac = new (window.AudioContext || window.webkitAudioContext)();

function reproducirSerie() {
  detenerReproduccion();

  const nivel = parseInt(document.getElementById("nivel").value);
  const velocidad = parseInt(document.getElementById("velocidad").value);
  const intervalo = 1.4 - (velocidad * 0.2);
  const duracion = intervalo * 0.9;

  respuesta = [];
  serie = [...todasLasNotas].sort(() => Math.random() - 0.5).slice(0, nivel);

  for (let i = 0; i < serie.length; i++) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = serie[i].freq;
    osc.connect(gain);
    gain.connect(ac.destination);

    const t = ac.currentTime + i * intervalo;
    osc.start(t);
    osc.stop(t + duracion);

    osciladoresActivos.push(osc);
  }

  document.getElementById("respuesta").innerHTML = "";
  document.getElementById("resultado").innerHTML = "";
  document.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("correct", "incorrect")
  );
}

function detenerReproduccion() {
  osciladoresActivos.forEach(osc => {
    try {
      osc.stop();
    } catch {}
  });
  osciladoresActivos = [];
}

function crearBotones() {
  const contenedorNaturales = document.getElementById("teclas-naturales");
  const contenedorAlteradas = document.getElementById("teclas-alteradas");
  contenedorNaturales.innerHTML = "";
  contenedorAlteradas.innerHTML = "";

  const crear = (nota, contenedor, claseExtra = "") => {
    const btn = document.createElement("button");
    btn.innerHTML = nota.texto || "";
    if (claseExtra) btn.classList.add(claseExtra);

    if (nota.id) {
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
    }

    contenedor.appendChild(btn);
  };

  notasNaturales.forEach(n => crear(n, contenedorNaturales));
  notasAlteradas.forEach(n => {
    if (n.espacio) {
      crear({ texto: "" }, contenedorAlteradas, "ghost");
    } else {
      crear(n, contenedorAlteradas);
    }
  });
}

function actualizarRespuesta() {
  const contenedor = document.getElementById("respuesta");
  contenedor.innerHTML = "";

  respuesta.forEach((id, i) => {
    const esperado = serie[i]?.id;
    const nota = todasLasNotas.find(n => n.id === id);
    const span = document.createElement("span");

    span.textContent = nota ? nota.texto.replace(/<br>/g, "/") : id;

    if (esperado && id !== esperado) {
      span.style.color = "red";
    } else {
      span.style.color = "#333";
    }

    span.style.marginRight = "0.4rem";
    contenedor.appendChild(span);
  });
}

function verificar() {
  const nivel = parseInt(document.getElementById("nivel").value);
  const velocidad = parseInt(document.getElementById("velocidad").value);
  const resultado = document.getElementById("resultado");

  let puntos = 0;
  let errores = 0;

  // 1. Calcular puntos por aciertos y errores
  respuesta.forEach((id, i) => {
    if (serie[i]?.id === id) {
      puntos += 100;
    } else {
      errores++;
    }
  });

  // 2. Bonus por ejercicio perfecto
  let esPerfecto = errores === 0;
  if (esPerfecto) {
    puntos += 100 * nivel;
    rachaPerfecta++;
  } else {
    rachaPerfecta = 0;
  }

  // 3. Penalización por errores
  puntos -= errores * 50;

  // 4. Multiplicador por velocidad
  const multiplicadores = {
    1: 0.8,
    2: 0.9,
    3: 1.0,
    4: 1.1,
    5: 1.2
  };
  const factorVelocidad = multiplicadores[velocidad] || 1;
  puntos = Math.round(puntos * factorVelocidad);

  // 5. Multiplicador por racha perfecta
  if (esPerfecto && rachaPerfecta > 1) {
    puntuacionTotal *= rachaPerfecta;
  }

  // 6. Sumar puntos al total acumulado
  puntuacionTotal += puntos;

  // 7. Actualizar marcador y mensaje
  document.getElementById("valor-puntuacion").textContent = puntuacionTotal;
  resultado.textContent = esPerfecto ? "✔ Correcto" : "";
}

document.getElementById("start").onclick = reproducirSerie;
document.getElementById("pause").onclick = detenerReproduccion;
document.addEventListener("DOMContentLoaded", crearBotones);