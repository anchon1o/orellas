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

let modo = "directo";
let reproduciendo = false;
let yaRespondio = false;
let usarOctavaSuperior = false;
let usarOctavaInferior = false;
let serie = [];
let respuesta = [];
let osciladoresActivos = [];
let puntuacionTotal = 0;
let ultimaReproduccion = [];
let soloNaturales = false;

const ac = new (window.AudioContext || window.webkitAudioContext)();

function reproducirSerie() {
  detenerReproduccion();

  const nivel = parseInt(document.getElementById("nivel").value);
  const velocidad = parseInt(document.getElementById("velocidad").value);
  const intervalo = 1.4 - (velocidad * 0.2);
  const duracion = intervalo * 0.9;

  respuesta = [];
  yaRespondio = false;
  reproduciendo = true;
  document.getElementById("repeat").disabled = false;

  const disponibles = soloNaturales ? notasNaturales : todasLasNotas;
  serie = [...disponibles].sort(() => Math.random() - 0.5).slice(0, nivel);
  ultimaReproduccion = [];

  if (modo === "memoria") {
    document.getElementById("teclas-naturales").style.display = "none";
    document.getElementById("teclas-alteradas").style.display = "none";
  }

  for (let i = 0; i < serie.length; i++) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const tipoOnda = document.getElementById("forma-onda")?.value || "sine";
    osc.type = tipoOnda;

    let freq = serie[i].freq;
    if (usarOctavaSuperior && Math.random() < 0.5) freq *= 2;
    if (usarOctavaInferior && Math.random() < 0.5) freq /= 2;
    osc.frequency.value = freq;

    ultimaReproduccion.push({ freq });

    osc.connect(gain);
    gain.connect(ac.destination);

    const t = ac.currentTime + i * intervalo;
    osc.start(t);
    osc.stop(t + duracion);

    osciladoresActivos.push(osc);
  }

  setTimeout(() => {
    if (modo === "memoria") {
      document.querySelectorAll("#teclas-naturales button, #teclas-alteradas button").forEach(btn => btn.disabled = false);
      document.getElementById("teclas-naturales").style.display = "flex";
      if (!soloNaturales) {
        document.getElementById("teclas-alteradas").style.display = "flex";
      }
    }
    reproduciendo = false;
  }, nivel * intervalo * 1000);

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
        const velocidad = parseInt(document.getElementById("velocidad").value);

        if (modo === "memoria" && reproduciendo) return;
        if (modo === "memoria" && yaRespondio) return;
        if (respuesta.length >= nivel) return;

        respuesta.push(nota.id);

        if (modo === "memoria" && respuesta.length === 1) {
          document.getElementById("repeat").disabled = true;
        }

        actualizarRespuesta();

        const index = respuesta.length - 1;
        const esperado = serie[index].id;

        const multiplicadores = {
          1: 0.8,
          2: 0.9,
          3: 1.0,
          4: 1.1,
          5: 1.2
        };
        const multiplicador = multiplicadores[velocidad] || 1;

        if (nota.id === esperado) {
          puntuacionTotal += Math.round(10 * multiplicador);
          btn.classList.add("correct");
        } else {
          puntuacionTotal = Math.floor(puntuacionTotal / 2);
          btn.classList.add("incorrect");
        }

        document.getElementById("valor-puntuacion").textContent = puntuacionTotal;

        if (respuesta.length === nivel) {
          if (modo === "memoria") {
            yaRespondio = true;
            document.getElementById("repeat").disabled = true;
          }
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
    span.style.color = esperado && id !== esperado ? "red" : "#333";
    span.style.marginRight = "0.4rem";
    contenedor.appendChild(span);
  });
}

function verificar() {
  const nivel = parseInt(document.getElementById("nivel").value);
  const resultado = document.getElementById("resultado");
  const partitura = document.getElementById("partitura");

  const esPerfecto = respuesta.every((id, i) => id === serie[i].id);

  if (esPerfecto) {
    puntuacionTotal += nivel * 10;
    resultado.textContent = "✔ Correcto";
    partitura.innerHTML = "";
  } else {
    const solucionTexto = serie.map(n => n.texto.replace(/<br>/g, "/")).join(" – ");
    resultado.innerHTML = `<span style="color:green;">Solución: ${solucionTexto}</span>`;
    try {
      partitura.innerHTML = "";
      const VF = Vex.Flow;
      const renderer = new VF.Renderer(partitura, VF.Renderer.Backends.SVG);
      renderer.resize(400, 120);
      const context = renderer.getContext();
      const stave = new VF.Stave(10, 40, 380);
      stave.addClef("treble").setContext(context).draw();
      const notasVex = serie.map(n => {
        const nombre = n.id[0].toLowerCase();
        const alteracion = n.id.includes("#") ? "#" : "";
        return new VF.StaveNote({ clef: "treble", keys: [`${nombre}${alteracion}/4`], duration: "q" })
          .addAccidental(0, alteracion ? new VF.Accidental("#") : null);
      });
      VF.Formatter.FormatAndDraw(context, stave, notasVex);
    } catch (e) {
      console.warn("VexFlow no disponible:", e);
    }
  }

  document.getElementById("valor-puntuacion").textContent = puntuacionTotal;
}

document.getElementById("solo-naturales").addEventListener("change", e => {
  soloNaturales = e.target.checked;
  document.getElementById("teclas-alteradas").style.display = soloNaturales ? "none" : "flex";
  const nivelInput = document.getElementById("nivel");
  if (soloNaturales && parseInt(nivelInput.value) > 7) {
    nivelInput.value = 7;
    document.getElementById("nivel-valor").textContent = "7";
  }
  nivelInput.max = soloNaturales ? 7 : 12;
  crearBotones();
});

document.getElementById("octava-superior").addEventListener("change", e => {
  usarOctavaSuperior = e.target.checked;
});

document.getElementById("octava-inferior").addEventListener("change", e => {
  usarOctavaInferior = e.target.checked;
});

document.getElementById("start").onclick = reproducirSerie;
document.getElementById("pause").onclick = detenerReproduccion;

document.getElementById("repeat").onclick = () => {
  if (!ultimaReproduccion.length) return;

  detenerReproduccion();

  const nivel = parseInt(document.getElementById("nivel").value);
  puntuacionTotal -= nivel * 4;
  if (puntuacionTotal < 0) puntuacionTotal = 0;
  document.getElementById("valor-puntuacion").textContent = puntuacionTotal;

  if (modo === "memoria" && !yaRespondio) {
    document.getElementById("teclas-naturales").style.display = "none";
    document.getElementById("teclas-alteradas").style.display = "none";
  }

  const velocidad = parseInt(document.getElementById("velocidad").value);
  const intervalo = 1.4 - (velocidad * 0.2);
  const duracion = intervalo * 0.9;

  for (let i = 0; i < ultimaReproduccion.length; i++) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const tipoOnda = document.getElementById("forma-onda")?.value || "sine";
    osc.type = tipoOnda;
    osc.frequency.value = ultimaReproduccion[i].freq;

    osc.connect(gain);
    gain.connect(ac.destination);

    const t = ac.currentTime + i * intervalo;
    osc.start(t);
    osc.stop(t + duracion);

    osciladoresActivos.push(osc);
  }
};

document.addEventListener("DOMContentLoaded", crearBotones);
document.getElementById("modo").addEventListener("change", e => {
  modo = e.target.value;

  // Si cambiamos a modo directo, mostrar los teclados si estaban ocultos
  if (modo === "directo") {
    document.getElementById("teclas-naturales").style.display = "flex";
    if (!soloNaturales) {
      document.getElementById("teclas-alteradas").style.display = "flex";
    }
  }
});