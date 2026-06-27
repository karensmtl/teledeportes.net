// ════════════════════════════════════════════════════
//  BASE DE DATOS — localStorage
// ════════════════════════════════════════════════════

const DB_KEY = 'rj_articulos_v4';

const DEFAULTS = [
  {id:1,titulo:"Selección Colombia define nómina para el Mundial 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"28 de febrero de 2026",tiempoLectura:"4 min",imagen:"https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80",resumen:"La Tricolor anuncia sus 26 convocados y lista su preparación para la cita mundialista.",cuerpo:"<p>La selección colombiana dio a conocer a los 26 jugadores que viajarán al Mundial 2026. La nómina incluye a los referentes del equipo y a jóvenes promesas del fútbol colombiano.</p><blockquote>\"Tenemos un grupo equilibrado y con mucha hambre de triunfo.\" — Director técnico de la Selección Colombia</blockquote><p>El primer microciclo de preparación se realizará en la sede de la Federación, con amistosos confirmados ante Paraguay y Uruguay.</p>",tags:["deportes","selección colombia","mundial 2026"],relacionados:[2,4,9]},
  {id:2,titulo:"Mundial Femenino 2027: Colombia afina detalles para el torneo",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"27 de febrero de 2026",tiempoLectura:"5 min",imagen:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",resumen:"La selección femenina trabaja en su preparación con amistosos internacionales y nuevas jóvenes figuras.",cuerpo:"<p>El cuerpo técnico de la Selección Colombia Femenina confirmó su calendario de entrenamientos y amistosos previos al Mundial Femenino 2027.</p><blockquote>\"Esta generación tiene calidad y ambición. Vamos paso a paso.\" — Entrenadora nacional</blockquote><p>La plantilla incluye a jugadoras de la Liga Profesional Femenina y refuerzos de clubes en Brasil y Estados Unidos.</p>",tags:["deportes","fútbol femenino","mundial"],relacionados:[1,3,10]},
  {id:3,titulo:"Deportivo Cali cierra fichajes para el segundo semestre",categoria:"DEPORTES",autor:"Juan López",fecha:"27 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",resumen:"El equipo verdiblanco confirmó tres nuevas contrataciones de cara a la Liga BetPlay 2026.",cuerpo:"<p>El Deportivo Cali confirmó tres nuevos fichajes: el delantero uruguayo Matías Fernández, el mediocampista venezolano Carlos Medina y el portero James Ospino del Junior de Barranquilla.</p><blockquote>\"Llegan jugadores con hambre de triunfo. Estamos construyendo algo importante.\" — Director técnico Deportivo Cali</blockquote><p>Presentación oficial el próximo lunes en el Estadio Deportivo Cali. El equipo debuta el 8 de marzo visitando a Nacional.</p>",tags:["deportes","fútbol","deportivo cali"],relacionados:[8,9,10]},
  {id:4,titulo:"Calendario del Mundial 2026: grupos y fechas clave",categoria:"NOTICIAS",autor:"Redacción Deportes",fecha:"26 de febrero de 2026",tiempoLectura:"6 min",imagen:"https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",resumen:"Conoce cuándo juega Colombia, los rivales de grupo y los partidos decisivos del Mundial.",cuerpo:"<p>El Mundial 2026 ya tiene definido el calendario de la fase de grupos. Colombia debutará en la primera semana del torneo contra una selección europea.</p><h3>Grupo y rivales</h3><p>La Tricolor compartirá el grupo con Estados Unidos, Suecia y Arabia Saudita, en un emparejamiento exigente.</p><blockquote>\"Todos los partidos serán una final. Hay que estar concentrados desde el primer minuto.\" — Capitán de la Selección</blockquote>",tags:["noticias","mundial","fútbol"],relacionados:[1,5,8]},
  {id:5,titulo:"Éxito de Colombia en la fase de clasificación al Mundial",categoria:"NOTICIAS",autor:"Redacción Deportes",fecha:"25 de febrero de 2026",tiempoLectura:"4 min",imagen:"https://images.unsplash.com/photo-1517927033932-b4d6c77b99f2?w=800&q=80",resumen:"La selección aseguró su presencia en la Copa del Mundo con una victoria clave en Barranquilla.",cuerpo:"<p>El combinado nacional confirmó su clasificación al Mundial 2026 tras ganar 2-0 en casa y asegurar matemáticamente su ticket.</p><blockquote>\"La afición jugó un papel clave para lograr esta clasificación histórica.\" — Defensa central</blockquote><p>Ahora el equipo se concentra en los próximos encuentros de preparación y en la lista final de jugadores.</p>",tags:["noticias","selección colombia","eliminatorias"],relacionados:[1,4,9]},
  {id:6,titulo:"Festival Petronio Álvarez regresa a Cali con más de 400 grupos",categoria:"CULTURA",autor:"Redacción Cultura",fecha:"27 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",resumen:"La gran fiesta de la música del Pacífico se realizará del 12 al 17 de agosto. Entrada gratuita.",cuerpo:"<p>El Festival Petronio Álvarez 2026 se realizará del 12 al 17 de agosto en el Estadio Pascual Guerrero, con más de 400 agrupaciones de Chocó, Valle, Cauca y Nariño.</p><h3>Categorías en competencia</h3><p>Marimba, chirimía, violines caucanos, versión libre y agrupación libre. Nuevo espacio para la diáspora afrocolombiana.</p><blockquote>\"El Petronio es la fiesta más grande de la cultura afrocolombiana.\" — Directora del Festival</blockquote><p>Inscripciones hasta el 30 de abril. Entrada gratuita en todos los escenarios.</p>",tags:["cultura","música","petronio álvarez","cali"],relacionados:[11,12,13]},
  {id:7,titulo:"Inversión en infraestructura deportiva para el Mundial 2026",categoria:"POLÍTICA",autor:"Redacción Política",fecha:"26 de febrero de 2026",tiempoLectura:"4 min",imagen:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",resumen:"El gobierno aprobó nuevos recursos para modernizar estadios y centros de alto rendimiento.",cuerpo:"<p>El ministerio de deportes anunció un paquete de inversiones para mejorar estadios, canchas y centros de preparación que servirán de soporte al proceso mundialista.</p><blockquote>\"El deporte es un factor de integración y desarrollo nacional.\" — Ministro del Deporte</blockquote><p>Los recursos se destinarán a Cali, Barranquilla, Bogotá y zonas de entrenamiento en altura.</p>",tags:["política","deportes","mundial"],relacionados:[4,5,11]},
  {id:8,titulo:"Liga BetPlay 2026: arranque del segundo semestre",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"26 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80",resumen:"Deportivo Cali debuta el 8 de marzo visitando a Atlético Nacional.",cuerpo:"<p>La Dimayor confirmó el fixture del segundo semestre de la Liga BetPlay 2026. Arranca el 8 de marzo con el clásico Nacional vs Cali en el Atanasio Girardot.</p><blockquote>\"Este semestre tendremos un torneo muy parejo.\" — Presidente de la Dimayor</blockquote><p>La final está programada para junio de 2026.</p>",tags:["deportes","fútbol","liga betplay"],relacionados:[3,9,10]},
  {id:9,titulo:"Colombia convoca para la siguiente fecha de eliminatorias",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"25 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",resumen:"26 convocados para enfrentar a Brasil y Paraguay en la doble fecha de marzo.",cuerpo:"<p>La Selección Colombia confirmó 26 convocados para la doble fecha del 24 y 29 de marzo contra Brasil en Barranquilla y Paraguay en Asunción.</p><blockquote>\"Vamos con todo. Necesitamos los seis puntos.\" — Seleccionador nacional</blockquote><p>Colombia es cuarto con 22 puntos, a 4 de Uruguay.</p>",tags:["deportes","selección colombia","eliminatorias"],relacionados:[3,8,10]},
  {id:10,titulo:"Colombianos brillan en las clásicas europeas de primavera",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"24 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",resumen:"Los escarabajos protagonizan los primeros grandes resultados de la temporada.",cuerpo:"<p>Egan Bernal terminó top 5 en la última clásica belga. Nairo Quintana brilló en la Tirreno-Adriático y Daniel Martínez ganó una etapa en la París-Niza.</p><blockquote>\"El ciclismo colombiano sigue siendo potencia mundial.\" — Director de equipo</blockquote>",tags:["deportes","ciclismo","colombia","europa"],relacionados:[3,8,9]},
  {id:11,titulo:"Nueva exposición en el Museo La Tertulia",categoria:"CULTURA",autor:"Redacción Cultura",fecha:"26 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",resumen:"La muestra reúne 80 obras de artistas del Pacífico colombiano.",cuerpo:"<p>El Museo La Tertulia inauguró \"Raíces y Horizontes\", con más de 80 obras de 25 artistas del Pacífico: pinturas de gran formato, esculturas en madera y fotografías documentales.</p><blockquote>\"Esta exposición reconoce una región históricamente invisibilizada.\" — Directora del Museo</blockquote><p>Abierta hasta el 30 de abril. Martes a domingo, 10am-6pm. Entrada: $8.000.</p>",tags:["cultura","arte","museo la tertulia","cali"],relacionados:[6,12,13]},
  {id:12,titulo:"Película colombiana seleccionada para Cannes 2026",categoria:"CULTURA",autor:"Redacción Cultura",fecha:"25 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",resumen:"El largometraje rodado en el Pacífico colombiano va a la sección Un Certain Regard.",cuerpo:"<p>\"El río que nos habita\" de la cineasta caleña Valentina Mosquera fue seleccionada para Un Certain Regard de Cannes 2026. Rodada en el Baudó chocoano con actores no profesionales.</p><blockquote>\"Esta película no es solo mía. Es de la comunidad que confió en nosotros.\" — Valentina Mosquera</blockquote>",tags:["cultura","cine","cannes","colombia"],relacionados:[6,11,13]},
  {id:13,titulo:"Feria Internacional del Libro de Bogotá abre en abril",categoria:"CULTURA",autor:"Redacción Cultura",fecha:"24 de febrero de 2026",tiempoLectura:"3 min",imagen:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",resumen:"La FILBO 2026 tendrá a Portugal como invitado de honor con más de 600 actividades.",cuerpo:"<p>La FILBO 2026 abre el 23 de abril en Corferias con Portugal como invitado de honor, más de 600 actividades y editoriales de 40 países. Se esperan 400.000 visitantes.</p><blockquote>\"Colombia es un país de lectores. La FILBO es nuestra mejor carta de presentación.\" — Director FILBO</blockquote>",tags:["cultura","literatura","filbo","bogotá"],relacionados:[6,11,12]},
  {id:14,titulo:"Sabores del Valle: los mejores platos de nuestra cocina",categoria:"CULTURA",autor:"Redacción Cultura",fecha:"23 de febrero de 2026",tiempoLectura:"4 min",imagen:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",resumen:"Chuleta valluna, sancocho de gallina y aborrajados encabezan los platos más representativos.",cuerpo:"<p>La gastronomía del Valle fusiona tradiciones indígenas, africanas y españolas. La chuleta valluna es el plato emblema: cerdo apanado y frito con arroz, frijoles y patacones.</p><h3>El sancocho de gallina criolla</h3><p>Preparado en fogón de leña con gallina criolla, yuca, plátano y mazorca. Es reunión familiar, domingo en el campo.</p><blockquote>\"Nuestra cocina es nuestra historia.\" — Chef vallecaucana</blockquote>",tags:["cultura","gastronomía","valle del cauca"],relacionados:[6,11,12]}
];

// ── API con localStorage ──────────────────────────────
function dbGetAll() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) { localStorage.setItem(DB_KEY, JSON.stringify(DEFAULTS)); return JSON.parse(JSON.stringify(DEFAULTS)); }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) { localStorage.setItem(DB_KEY, JSON.stringify(DEFAULTS)); return JSON.parse(JSON.stringify(DEFAULTS)); }
    return arr;
  } catch(e) { return JSON.parse(JSON.stringify(DEFAULTS)); }
}
function dbGetById(id) { return dbGetAll().find(a => a.id === Number(id)) || null; }
function dbSave(art) {
  const todos = dbGetAll();
  if (!art.id) { art.id = todos.reduce((m,a)=>Math.max(m,a.id||0),0)+1; todos.unshift(art); }
  else { const idx=todos.findIndex(a=>a.id===Number(art.id)); if(idx!==-1) todos[idx]=art; else { art.id=todos.reduce((m,a)=>Math.max(m,a.id||0),0)+1; todos.unshift(art); } }
  localStorage.setItem(DB_KEY, JSON.stringify(todos));
  return art;
}
function dbDelete(id) { localStorage.setItem(DB_KEY, JSON.stringify(dbGetAll().filter(a=>a.id!==Number(id)))); }

const CATS_DB = ["NOTICIAS", "POLÍTICA", "DEPORTES", "CULTURA"];

// ════════════════════════════════════════════════════
//  BASE DE DATOS DE VIDEOS (YouTube)
// ════════════════════════════════════════════════════
const VIDEO_NEWS = [
  {id:'v1',titulo:"Colombia clasifica al Mundial 2026: la noche que paralizó al país",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"4 de septiembre de 2025",youtubeId:"Cz2xm4VWzJE",link:"https://www.youtube.com/watch?v=Cz2xm4VWzJE",resumen:"Resumen y goles del partido Colombia vs Bolivia. La Selección goleó 3-0 y selló su clasificación al Mundial 2026."},
  {id:'v2',titulo:"Resumen del clásico Nacional vs Cali 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"9 de agosto de 2025",youtubeId:"2BM1ImeIjSc",link:"https://www.youtube.com/watch?v=2BM1ImeIjSc",resumen:"Todos los goles y las mejores jugadas del clásico del Valle entre Atlético Nacional y Deportivo Cali."},
  {id:'v3',titulo:"Deportivo Cali vs La Equidad: resumen Liga BetPlay 2025",categoria:"DEPORTES",autor:"Juan López",fecha:"18 de mayo de 2025",youtubeId:"fi7rsOd16Gw",link:"https://www.youtube.com/watch?v=fi7rsOd16Gw",resumen:"Resumen completo del partido entre Deportivo Cali y La Equidad por la Liga Colombiana 2025-I."},
  {id:'v4',titulo:"Análisis del calendario de Colombia en el Mundial 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"15 de agosto de 2025",youtubeId:"xNjh-wQ07Cw",link:"https://www.youtube.com/watch?v=xNjh-wQ07Cw",resumen:"Un análisis de los rivales, fechas y clave para que Colombia avance en la Copa del Mundo."},
  {id:'v5',titulo:"Colombia vs Perú: eliminatorias al Mundial 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"15 de septiembre de 2025",youtubeId:"aNbCHHqnakw",link:"https://www.youtube.com/watch?v=aNbCHHqnakw",resumen:"Resumen y análisis del partido Colombia vs Perú por las eliminatorias sudamericanas rumbo al Mundial 2026."},
  {id:'v6',titulo:"Golazo histórico de James Rodríguez en la jornada de eliminatorias",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"22 de junio de 2025",youtubeId:"UvdFN_-IMw8",link:"https://www.youtube.com/watch?v=UvdFN_-IMw8",resumen:"La jugada, el gol y la celebración de James Rodríguez en el triunfo que puso a Colombia en ventaja."},
  {id:'v7',titulo:"Club América presenta nuevo técnico con vista al Mundial 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"10 de septiembre de 2025",youtubeId:"lHYHWwefArQ",link:"https://www.youtube.com/watch?v=lHYHWwefArQ",resumen:"El club anuncia su nuevo entrenador y su plan para llegar con jugadores en forma al Mundial."},
  {id:'v8',titulo:"Colombia lista para el Mundial 2026: análisis y expectativas",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"20 de septiembre de 2025",youtubeId:"3HH4fmm6mhs",link:"https://www.youtube.com/watch?v=3HH4fmm6mhs",resumen:"Análisis completo de la Selección Colombia rumbo al Mundial 2026: figuras, estadísticas y expectativas."},
  {id:'v9',titulo:"Preview de la Copa América Sub-23 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"14 de septiembre de 2025",youtubeId:"3x2BH_gFy2s",link:"https://www.youtube.com/watch?v=3x2BH_gFy2s",resumen:"Los mejores talentos juveniles del continente se preparan para el torneo que puede definir su futuro."},
  {id:'v10',titulo:"Final de la Liga BetPlay 2026: los goles del título",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"5 de julio de 2025",youtubeId:"A_U4kO9m788",link:"https://www.youtube.com/watch?v=A_U4kO9m788",resumen:"Las mejores anotaciones y el festejo del campeón de la Liga BetPlay 2026."},
  {id:'v11',titulo:"Selección Colombia femenina se prepara para el Mundial",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"24 de septiembre de 2025",youtubeId:"-XLb-PiUGuo",link:"https://www.youtube.com/watch?v=-XLb-PiUGuo",resumen:"Entrenamientos, convocadas y expectativas de la selección femenina rumbo a la Copa del Mundo."},
  {id:'v12',titulo:"Atletismo colombiano gana medalla en el Sudamericano 2026",categoria:"DEPORTES",autor:"Redacción Deportes",fecha:"30 de agosto de 2025",youtubeId:"zeD_tU8J2l0",link:"https://www.youtube.com/watch?v=zeD_tU8J2l0",resumen:"La delegación colombiana celebró con una medalla de oro en los 400 metros planos."}
];

// ════════════════════════════════════════════════════
//  CONTROL DE VIDEO — UN SOLO VIDEO A LA VEZ
// ════════════════════════════════════════════════════
let _activeVideoId = null;

function _pauseActive() {
  if (!_activeVideoId) return;
  const iframe = document.getElementById('vframe_' + _activeVideoId);
  if (iframe) {
    iframe.src = '';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
  }
  const wrap = document.getElementById('vcardwrap_' + _activeVideoId);
  if (wrap) wrap.classList.remove('vcard_playing');
  _activeVideoId = null;
}

function toggleVideoCard(videoId, e) {
  if (e) e.stopPropagation();
  if (_activeVideoId === videoId) { _pauseActive(); return; }
  _pauseActive();
  const iframe = document.getElementById('vframe_' + videoId);
  if (iframe) {
    iframe.src = iframe.getAttribute('data-src') + '&autoplay=1';
    iframe.style.opacity = '1';
    iframe.style.pointerEvents = 'all';
  }
  const wrap = document.getElementById('vcardwrap_' + videoId);
  if (wrap) wrap.classList.add('vcard_playing');
  _activeVideoId = videoId;
}

// ════════════════════════════════════════════════════
//  HELPER: genera tarjeta de video para el carrusel
// ════════════════════════════════════════════════════
function _videoCardHTML(v) {
  return `
    <div class="rj_vcard">
      <div class="rj_vcard_video" id="vcardwrap_${v.id}">
        <img class="rj_vcard_thumb"
             src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg"
             alt="${v.titulo}"
             onerror="this.style.display='none'">
        <iframe
          id="vframe_${v.id}"
          src=""
          data-src="https://www.youtube.com/embed/${v.youtubeId}?rel=0&modestbranding=1&enablejsapi=1"
          title="${v.titulo}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="position:absolute;inset:0;width:100%;height:100%;border:none;opacity:0;pointer-events:none;transition:opacity .3s;">
        </iframe>
        <div class="rj_vcard_play_overlay" onclick="toggleVideoCard('${v.id}', event)">
          <div class="rj_vcard_play_btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="5,3 18,10 5,17" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="rj_vcard_body" onclick="openVideoArticle('${v.id}')">
        <div class="rj_vcard_cat">${v.categoria}</div>
        <div class="rj_vcard_title">${v.titulo}</div>
        <div class="rj_vcard_meta">${v.autor} · ${v.fecha}</div>
        <a class="rj_vcard_readmore"
           href="javascript:void(0)"
           onclick="event.stopPropagation(); openVideoArticle('${v.id}')">
          LEER NOTA COMPLETA &rarr;
        </a>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════
//  ÍNDICES de carrusel por sección
// ════════════════════════════════════════════════════
const _vIdx = { '': 0, Noticias: 0, Deportes: 0, Cultura: 0, Politica: 0 };
const _catToSuffix = {
  'NOTICIAS': 'Noticias',
  'DEPORTES': 'Deportes',
  'CULTURA':  'Cultura',
  'POLÍTICA': 'Politica'
};

// ════════════════════════════════════════════════════
//  RENDER SECCIÓN DE VIDEOS (HOME y categorías)
// ════════════════════════════════════════════════════
function renderVideoSection(filterCat) {
  const suffix  = filterCat ? (_catToSuffix[filterCat] || '') : '';
  const gridId  = 'videoGrid'    + suffix;
  const sectId  = 'videoSection' + suffix;
  const countId = 'videoCount'   + suffix;

  const section = document.getElementById(sectId);
  const grid    = document.getElementById(gridId);
  const countEl = document.getElementById(countId);
  if (!section || !grid) return;

  _pauseActive();

  const videos = filterCat
    ? VIDEO_NEWS.filter(v => v.categoria === filterCat)
    : VIDEO_NEWS;

  if (!videos.length) { section.style.display = 'none'; return; }

  section.style.display = 'block';
  _vIdx[suffix] = 0;
  grid.style.transform = 'translateX(0)';
  grid.innerHTML = videos.map(_videoCardHTML).join('');

  if (countEl)
    countEl.textContent = videos.length + ' VIDEO' + (videos.length !== 1 ? 'S' : '');

  setTimeout(() => videoCarouselScroll(0, suffix), 100);
}

// ════════════════════════════════════════════════════
//  NAVEGACIÓN CARRUSEL DE VIDEOS
// ════════════════════════════════════════════════════
function videoCarouselScroll(dir, suffix) {
  if (suffix === undefined) suffix = '';
  const gridId = 'videoGrid' + suffix;
  const prevId = 'videoPrev'  + suffix;
  const nextId = 'videoNext'  + suffix;

  const track = document.getElementById(gridId);
  if (!track || !track.children.length) return;

  const outer   = track.parentElement;
  const gap     = parseInt(getComputedStyle(track).gap) || 16;
  const cw      = track.children[0].offsetWidth + gap;
  const visible = Math.max(1, Math.floor(outer.offsetWidth / cw));
  const maxIdx  = Math.max(0, track.children.length - visible);

  _vIdx[suffix] = Math.min(Math.max((_vIdx[suffix] || 0) + dir, 0), maxIdx);
  track.style.transform = 'translateX(-' + (_vIdx[suffix] * cw) + 'px)';

  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (prev) prev.style.opacity = _vIdx[suffix] === 0     ? '0.35' : '1';
  if (next) next.style.opacity = _vIdx[suffix] >= maxIdx ? '0.35' : '1';
}

// ════════════════════════════════════════════════════
//  RENDERIZADO PRINCIPAL
// ════════════════════════════════════════════════════
function renderHome() {
  const todos = dbGetAll();

  // ── HERO izquierdo = reproductor estático en HTML, no se toca ──

  // ── SIDEBAR ──
  const side = document.getElementById('heroSide');
  if (side) {
    const featured = todos.filter(a => a.categoria === 'DEPORTES');
    const displayItems = featured.length ? featured.slice(0,4) : todos.slice(0,4);
    side.innerHTML = displayItems.map(a => `
      <div class="rj_side_item" onclick="openArticle(${a.id})">
        <div class="rj_side_img"><img src="${a.imagen}" alt="${a.titulo}" onerror="this.src='logo.png'"></div>
        <div class="rj_side_body">
          <span class="rj_side_cat">${a.categoria}</span>
          <div class="rj_side_title">${a.titulo}</div>
          <div class="rj_side_date">${a.fecha}</div>
        </div>
      </div>`).join('');
  }

  // ── CARRUSEL NOTICIAS ──
  const allGrid = document.getElementById('allNewsGrid');
  if (allGrid) {
    const sportsNews = todos.filter(a => a.categoria === 'DEPORTES');
    const homeNews = sportsNews.length ? sportsNews : todos;
    _carouselIndex = 0;
    allGrid.style.transform = 'translateX(0)';
    allGrid.innerHTML = homeNews.map(a => `
      <div class="rj_card" onclick="openArticle(${a.id})">
        <div class="rj_card_img"><img src="${a.imagen}" alt="${a.titulo}" onerror="this.src='logo.png'"></div>
        <div class="rj_card_cat">${a.categoria}</div>
        <div class="rj_card_title">${a.titulo}</div>
        <div class="rj_card_meta">${a.autor} · ${a.fecha}</div>
      </div>`).join('');
    const cnt = document.getElementById('allNewsCount');
    if (cnt) cnt.textContent = homeNews.length + ' artículo' + (homeNews.length !== 1 ? 's' : '');
    setTimeout(() => carouselScroll(0), 100);
  }

  // ── PÁGINA TODAS ──
  const allGridPage = document.getElementById('allNewsGridPage');
  if (allGridPage) {
    allGridPage.innerHTML = todos.map(a => `
      <div class="news_card" onclick="openArticle(${a.id})" style="cursor:pointer">
        <div><img src="${a.imagen}" alt="${a.titulo}" onerror="this.src='logo.png'"></div>
        <div class="new_card_cat">${a.categoria}</div>
        <div class="new_card_title"><span>${a.titulo}</span></div>
        <p class="card_text">${a.resumen ? a.resumen.substring(0,100)+(a.resumen.length>100?'…':'') : ''}</p>
        <div class="autor">${a.autor} · ${a.fecha}</div>
      </div>`).join('');
    const cntNav = document.getElementById('allNewsCountNav');
    if (cntNav) cntNav.textContent = todos.length + ' artículo' + (todos.length !== 1 ? 's' : '');
  }

  // ── GRIDS POR CATEGORÍA ──
  const mapGrid = {
    gridNoticias: ['NOTICIAS'],
    gridDeportes: ['DEPORTES'],
    gridCultura:  ['CULTURA'],
    gridPolitica: ['POLÍTICA']
  };
  Object.entries(mapGrid).forEach(([gridId, cats]) => {
    const el = document.getElementById(gridId);
    if (!el) return;
    const arts = todos.filter(a => cats.includes(a.categoria));
    if (!arts.length) {
      el.innerHTML = '<p style="color:#555;padding:40px;text-align:center">No hay artículos en esta categoría aún.</p>';
      return;
    }
    const [dest, ...resto] = arts;
    let html = `
      <div class="cat_card featured" onclick="openArticle(${dest.id})" style="cursor:pointer">
        <div class="cat_card_img"><img src="${dest.imagen}" alt="${dest.titulo}" onerror="this.src='logo.png'"></div>
        <div class="cat_card_body">
          <div class="cat_card_cat">DESTACADO</div>
          <div class="cat_card_title">${dest.titulo}</div>
          <p class="cat_card_text">${dest.resumen}</p>
          <div class="autor">${dest.fecha} · ${dest.autor}</div>
        </div>
      </div>`;
    for (let i = 0; i < resto.length; i += 2) {
      html += `<div class="cat_subgrid">${resto.slice(i,i+2).map(a=>`
        <div class="cat_card" onclick="openArticle(${a.id})" style="cursor:pointer">
          <div class="cat_card_img"><img src="${a.imagen}" alt="${a.titulo}" onerror="this.src='logo.png'"></div>
          <div class="cat_card_body">
            <div class="cat_card_cat">${a.categoria}</div>
            <div class="cat_card_title">${a.titulo}</div>
            <p class="cat_card_text">${a.resumen.substring(0,90)}…</p>
            <div class="autor">${a.fecha}</div>
          </div>
        </div>`).join('')}</div>`;
    }
    el.innerHTML = html;
  });

  // ── SECCIÓN DE VIDEOS (HOME) ──
  renderVideoSection();
}

// ════════════════════════════════════════════════════
//  ABRIR ARTÍCULO DE TEXTO
// ════════════════════════════════════════════════════
function openArticle(id) {
  const art = dbGetById(id);
  if (!art) { alert('Artículo no encontrado. ID: ' + id); return; }
  if (typeof heroStopLive === 'function') heroStopLive();
  _pauseActive();
  const vis = [...document.querySelectorAll('.homePage,.page_cat')].find(el => el.offsetParent !== null);
  sessionStorage.setItem('paginaAnterior', vis ? vis.id || 'homePage' : 'homePage');
  document.querySelectorAll('.homePage,.page_cat,#adminPage').forEach(el => el.style.display = 'none');

  const rels = (art.relacionados||[]).map(rid=>dbGetById(rid)).filter(Boolean);
  const relHTML = rels.length
    ? rels.map(r=>`<div class="art-rel-card" onclick="openArticle(${r.id})"><div class="art-rel-img"><img src="${r.imagen}" onerror="this.src='logo.png'"><span class="art-rel-cat">${r.categoria}</span></div><div class="art-rel-body"><div class="art-rel-title">${r.titulo}</div><div class="art-rel-meta">${r.autor} · ${r.fecha}</div></div></div>`).join('')
    : '<p class="art-no-rel">No hay artículos relacionados.</p>';

  const pg = document.getElementById('articlePage');
  pg.innerHTML = `
    <div class="article-wrap">
      <div class="article-breadcrumb">
        <a onclick="closeArticle()">Inicio</a><span>›</span>
        <a onclick="closeArticle();mostrarCat('${art.categoria}')">${art.categoria}</a><span>›</span>
        <span>${art.titulo.substring(0,45)}${art.titulo.length>45?'...':''}</span>
      </div>
      <div class="article-top-tag">${art.categoria}</div>
      <h1 class="article-title">${art.titulo}</h1>
      <p class="article-deck">${art.resumen}</p>
      <div class="article-meta">
        <span class="author">&#9997; ${art.autor}</span>
        <span style="color:#2e2e2e">·</span>
        <span>&#128336; ${art.tiempoLectura||'3 min'}</span>
        <span style="color:#2e2e2e">·</span>
        <span>&#128197; ${art.fecha}</span>
      </div>
      <div class="article-hero-img"><img src="${art.imagen}" alt="${art.titulo}" onerror="this.style.display='none'"></div>
      <p class="article-img-caption">&#128247; Imagen ilustrativa · TELEDEPORTES</p>
      <div class="article-body">${art.cuerpo}</div>
      <div class="art-tags">${(art.tags||[]).map(t=>`<span class="art-tag">#${t}</span>`).join('')}</div>
      <button class="article-back-btn" onclick="closeArticle()">&#8592; Volver a ${art.categoria}</button>
    </div>
    <section class="art-relacionados">
      <div class="art-rel-inner">
        <h2 class="art-rel-heading"><span class="art-rel-line"></span>Artículos relacionados<span class="art-rel-line"></span></h2>
        <div class="art-rel-grid">${relHTML}</div>
      </div>
    </section>`;
  pg.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════
//  ABRIR ARTÍCULO DE VIDEO
// ════════════════════════════════════════════════════
function openVideoArticle(videoId) {
  const vid = VIDEO_NEWS.find(v => v.id === videoId);
  if (!vid) { alert('Video no encontrado.'); return; }
  if (typeof heroStopLive === 'function') heroStopLive();
  _pauseActive();
  const vis = [...document.querySelectorAll('.homePage,.page_cat')].find(el => el.offsetParent !== null);
  sessionStorage.setItem('paginaAnterior', vis ? vis.id || 'homePage' : 'homePage');
  document.querySelectorAll('.homePage,.page_cat,#adminPage').forEach(el => el.style.display = 'none');

  const otrosVideos = VIDEO_NEWS.filter(v => v.id !== videoId).slice(0, 4);
  const relHTML = otrosVideos.map(v=>`
    <div class="art-rel-card" onclick="openVideoArticle('${v.id}')" style="cursor:pointer">
      <div class="art-rel-img" style="position:relative;">
        <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="${v.titulo}">
        <span class="art-rel-cat">${v.categoria}</span>
      </div>
      <div class="art-rel-body">
        <div class="art-rel-title">${v.titulo}</div>
        <div class="art-rel-meta">${v.autor} · ${v.fecha}</div>
      </div>
    </div>`).join('');

  const pg = document.getElementById('articlePage');
  pg.innerHTML = `
    <div class="article-wrap">
      <div class="article-breadcrumb">
        <a onclick="closeArticle()">Inicio</a><span>›</span>
        <a onclick="closeArticle();mostrarCat('${vid.categoria}')">${vid.categoria}</a><span>›</span>
        <span>${vid.titulo.substring(0,45)}${vid.titulo.length>45?'...':''}</span>
      </div>
      <div class="article-top-tag">${vid.categoria}</div>
      <h1 class="article-title">${vid.titulo}</h1>
      <p class="article-deck">${vid.resumen}</p>
      <div class="article-meta">
        <span class="author">&#9997; ${vid.autor}</span>
        <span style="color:#2e2e2e">·</span>
        <span>&#128197; ${vid.fecha}</span>
      </div>
      <div class="art_video_wrap" style="margin-top:0;">
        <div class="art_video_label">&#9654; VIDEO</div>
        <div class="art_video_frame">
          <iframe src="https://www.youtube.com/embed/${vid.youtubeId}?rel=0&modestbranding=1&autoplay=1"
            title="${vid.titulo}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
      <p class="article-img-caption" style="margin-top:6px;">&#9654; ${vid.titulo} · ${vid.autor}</p>
      <div class="article-body">
        <p>${vid.resumen}</p>
        <p>Para ver el video completo, puede <a href="${vid.link}" target="_blank" rel="noopener" style="color:#e53e3e;font-weight:700;">verlo directamente en YouTube</a>.</p>
      </div>
      <button class="article-back-btn" onclick="closeArticle()">&#8592; Volver a ${vid.categoria}</button>
    </div>
    <section class="art-relacionados">
      <div class="art-rel-inner">
        <h2 class="art-rel-heading"><span class="art-rel-line"></span>Más videos<span class="art-rel-line"></span></h2>
        <div class="art-rel-grid">${relHTML}</div>
      </div>
    </section>`;
  pg.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════
//  CERRAR ARTÍCULO
// ════════════════════════════════════════════════════
function closeArticle() {
  _pauseActive();
  document.getElementById('articlePage').style.display = 'none';
  const ant = sessionStorage.getItem('paginaAnterior') || 'homePage';
  if (ant === 'home' || ant === 'homePage') document.querySelector('.homePage').style.display = 'block';
  else { const el = document.getElementById(ant); if(el) el.style.display='block'; else document.querySelector('.homePage').style.display='block'; }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarCat(cat) {
  document.querySelectorAll('.homePage,.page_cat,#articlePage,#adminPage').forEach(el => el.style.display = 'none');
  const map = { NOTICIAS:'catNoticias', DEPORTES:'catDeportes', CULTURA:'catCultura', POLÍTICA:'catPolitica' };
  const id = map[cat];
  if (id) document.getElementById(id).style.display = 'block';
  else document.querySelector('.homePage').style.display = 'block';
}

// ════════════════════════════════════════════════════
//  NAVEGACIÓN
// ════════════════════════════════════════════════════
function showHome(seccion) {
  if (typeof heroStopLive === 'function') heroStopLive();
  _pauseActive();
  document.querySelectorAll('.homePage,.page_cat,#articlePage,#adminPage').forEach(el => el.style.display = 'none');

  if (!seccion) {
    document.querySelector('.homePage').style.display = 'block';
    renderVideoSection();
    return;
  }

  const pageMap = { noticias:'catNoticias', deportes:'catDeportes', cultura:'catCultura', politica:'catPolitica', todas:'catTodas' };
  const el = document.getElementById(pageMap[seccion]);
  if (el) el.style.display = 'block';

  const catMap = { noticias:'NOTICIAS', deportes:'DEPORTES', cultura:'CULTURA', politica:'POLÍTICA' };
  if (catMap[seccion]) renderVideoSection(catMap[seccion]);
}

function goHome() { showHome(); }

function setActive(el) {
  document.querySelectorAll('.nav_linka a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

// ════════════════════════════════════════════════════
//  PANEL DE ADMINISTRACIÓN
// ════════════════════════════════════════════════════
const ADMIN_PASS = 'teledeportes2026';
let _art = null;

function abrirAdmin() {
  const clave = prompt('🔐 Contraseña de administrador:');
  if (clave === null) return;
  if (clave !== ADMIN_PASS) { alert('Contraseña incorrecta.'); return; }
  _pauseActive();
  document.querySelectorAll('.homePage,.page_cat,#articlePage').forEach(el => el.style.display = 'none');
  document.getElementById('adminPage').style.display = 'block';
  adminLista();
}

function cerrarAdmin() {
  document.getElementById('adminPage').style.display = 'none';
  _art = null; renderHome();
  document.querySelector('.homePage').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function adminLista() {
  _art = null;
  const todos = dbGetAll();
  const pg = document.getElementById('adminPage');
  const filas = todos.length
    ? todos.map(a => `
        <tr onmouseover="this.style.background='#121212'" onmouseout="this.style.background=''">
          <td style="padding:12px 14px;font-family:monospace;font-size:.75em;color:#444">#${a.id}</td>
          <td style="padding:12px 14px"><span style="background:#1e1e1e;border:1px solid #2a2a2a;color:#c8b890;font-size:.62em;letter-spacing:.14em;font-weight:700;padding:3px 9px;border-radius:2px;text-transform:uppercase">${a.categoria}</span></td>
          <td style="padding:12px 14px"><div style="font-weight:600;color:#ddd;margin-bottom:3px">${a.titulo}</div><div style="font-size:.75em;color:#555">${a.autor} · ${a.fecha}</div></td>
          <td style="padding:12px 14px;text-align:right;white-space:nowrap">
            <button onclick="adminEditar(${a.id})" style="background:transparent;border:1px solid #3a3020;color:#c8b890;padding:5px 10px;font-family:inherit;font-size:.72em;border-radius:2px;cursor:pointer;margin-left:4px">✏ Editar</button>
            <button onclick="adminBorrar(${a.id})" style="background:transparent;border:1px solid #3a1a14;color:#c0604a;padding:5px 10px;font-family:inherit;font-size:.72em;border-radius:2px;cursor:pointer;margin-left:4px">🗑 Borrar</button>
          </td>
        </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;padding:48px;color:#444">No hay artículos. Crea el primero.</td></tr>`;
  pg.innerHTML = `
    <div style="background:#0f0f0f;border-bottom:1px solid #1e1e1e;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:100;font-family:'Arial Narrow',sans-serif">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:38px;height:38px;background:#c8b890;color:#111;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:3px;font-size:.9em">RJ</div>
        <div><div style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f0ece0">Panel de Administración</div><div style="font-size:.72em;color:#555">${todos.length} artículo${todos.length!==1?'s':''}</div></div>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="adminNuevo()" style="background:#c8b890;color:#111;border:none;padding:9px 18px;font-family:inherit;font-size:.82em;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:3px;cursor:pointer">+ Nuevo artículo</button>
        <button onclick="cerrarAdmin()" style="background:transparent;color:#888;border:1px solid #2e2e2e;padding:9px 14px;font-family:inherit;font-size:.8em;border-radius:3px;cursor:pointer">✕ Cerrar</button>
      </div>
    </div>
    <div style="padding:24px;font-family:'Arial Narrow',sans-serif">
      <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.87em">
          <thead><tr style="background:#141414;border-bottom:1px solid #2a2a2a">
            <th style="padding:11px 14px;text-align:left;font-size:.68em;letter-spacing:.15em;color:#555;text-transform:uppercase">ID</th>
            <th style="padding:11px 14px;text-align:left;font-size:.68em;letter-spacing:.15em;color:#555;text-transform:uppercase">Cat.</th>
            <th style="padding:11px 14px;text-align:left;font-size:.68em;letter-spacing:.15em;color:#555;text-transform:uppercase">Artículo</th>
            <th style="padding:11px 14px;text-align:right;font-size:.68em;letter-spacing:.15em;color:#555;text-transform:uppercase">Acciones</th>
          </tr></thead>
          <tbody style="border-collapse:collapse">${filas}</tbody>
        </table>
      </div>
    </div>`;
}

function adminNuevo() {
  _art = { id:null, titulo:'', categoria:'NOTICIAS', autor:'', fecha:_hoy(), tiempoLectura:'3 min', imagen:'', resumen:'', cuerpo:'', tags:[], relacionados:[] };
  adminEditor();
}
function adminEditar(id) {
  const a = dbGetById(id); if(!a){rjToast('Artículo no encontrado','err');return;}
  _art = { ...a, tags:[...(a.tags||[])], relacionados:[...(a.relacionados||[])] };
  adminEditor();
}
function adminBorrar(id) {
  const a = dbGetById(id);
  if(!a||!confirm(`¿Eliminar "${a.titulo}"?\nEsta acción no se puede deshacer.`)) return;
  dbDelete(id); renderHome(); adminLista(); rjToast('Artículo eliminado.');
}
function adminEditor() {
  const a = _art; const esNuevo = !a.id;
  const pg = document.getElementById('adminPage');
  const opCat = CATS_DB.map(c=>`<option value="${c}"${c===a.categoria?' selected':''}>${c}</option>`).join('');
  const otros = dbGetAll().filter(x=>x.id&&x.id!==a.id);
  const opRel = otros.length ? otros.map(x=>`<option value="${x.id}"${(a.relacionados||[]).includes(x.id)?' selected':''}>#${x.id} ${x.titulo.substring(0,40)}</option>`).join('') : '<option disabled>No hay otros artículos</option>';
  const S = (s='') => (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  pg.innerHTML = `
    <div style="background:#0f0f0f;border-bottom:1px solid #1e1e1e;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:100;font-family:'Arial Narrow',sans-serif">
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="adminLista()" style="background:transparent;border:1px solid #2e2e2e;color:#c8b890;padding:7px 14px;font-family:inherit;font-size:.78em;border-radius:3px;cursor:pointer">← Volver</button>
        <div style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f0ece0;font-size:.95em">${esNuevo?'Nuevo artículo':'Editando #'+a.id}</div>
      </div>
      <button onclick="adminGuardar()" style="background:#c8b890;color:#111;border:none;padding:9px 20px;font-family:inherit;font-size:.82em;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:3px;cursor:pointer">💾 Guardar</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;padding:20px 24px 60px;font-family:'Arial Narrow',sans-serif">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div><label style="display:block;font-size:.68em;letter-spacing:.13em;text-transform:uppercase;color:#555;margin-bottom:5px">Titular *</label>
        <input id="e_titulo" value="${S(a.titulo)}" placeholder="Escribe el titular..." style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:11px 13px;font-family:Georgia,serif;font-size:1.05em;font-weight:700;border-radius:3px;outline:none" oninput="_art.titulo=this.value" onfocus="this.style.borderColor='#c8b890'" onblur="this.style.borderColor='#262626'"></div>
        <div><label style="display:block;font-size:.68em;letter-spacing:.13em;text-transform:uppercase;color:#555;margin-bottom:5px">Resumen *</label>
        <textarea id="e_resumen" rows="3" placeholder="Texto breve que aparece en las tarjetas..." style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:10px 13px;font-family:Georgia,serif;font-size:.9em;border-radius:3px;outline:none;resize:vertical;line-height:1.6" oninput="_art.resumen=this.value" onfocus="this.style.borderColor='#c8b890'" onblur="this.style.borderColor='#262626'">${S(a.resumen)}</textarea></div>
        <div>
          <label style="display:block;font-size:.68em;letter-spacing:.13em;text-transform:uppercase;color:#555;margin-bottom:5px">Cuerpo * <span style="text-transform:none;letter-spacing:0;font-size:.9em;color:#444">— HTML: &lt;p&gt; &lt;h3&gt; &lt;blockquote&gt;</span></label>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">${[['p','¶ P'],['h3','H3'],['bq','" Cita'],['b','B'],['i','I'],['ul','Lista']].map(([t,l])=>`<button type="button" onclick="adminFmt('${t}')" style="background:#161616;border:1px solid #2a2a2a;color:#888;padding:5px 9px;font-family:inherit;font-size:.72em;border-radius:2px;cursor:pointer">${l}</button>`).join('')}</div>
          <textarea id="e_cuerpo" rows="16" placeholder="<p>Escribe el cuerpo completo aquí...</p>" style="width:100%;box-sizing:border-box;background:#0c0c0c;border:1px solid #262626;color:#a8d098;padding:10px 13px;font-family:'Courier New',monospace;font-size:.82em;border-radius:3px;outline:none;resize:vertical;line-height:1.7" oninput="_art.cuerpo=this.value" onfocus="this.style.borderColor='#c8b890'" onblur="this.style.borderColor='#262626'">${S(a.cuerpo)}</textarea>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;padding:14px">
          <div style="font-size:.68em;letter-spacing:.14em;text-transform:uppercase;color:#555;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #1e1e1e">📋 Información</div>
          <div style="margin-bottom:10px"><label style="display:block;font-size:.65em;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:4px">Categoría</label><select id="e_cat" onchange="_art.categoria=this.value" style="width:100%;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.85em;border-radius:3px;outline:none">${opCat}</select></div>
          <div style="margin-bottom:10px"><label style="display:block;font-size:.65em;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:4px">Autor *</label><input id="e_autor" value="${S(a.autor)}" placeholder="Nombre del autor" oninput="_art.autor=this.value" style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.85em;border-radius:3px;outline:none"></div>
          <div style="margin-bottom:10px"><label style="display:block;font-size:.65em;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:4px">Fecha</label><input id="e_fecha" value="${S(a.fecha)}" placeholder="28 de febrero de 2026" oninput="_art.fecha=this.value" style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.85em;border-radius:3px;outline:none"></div>
          <div><label style="display:block;font-size:.65em;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:4px">Tiempo de lectura</label><input id="e_lectura" value="${S(a.tiempoLectura||'3 min')}" placeholder="3 min" oninput="_art.tiempoLectura=this.value" style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.85em;border-radius:3px;outline:none"></div>
        </div>
        <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;padding:14px">
          <div style="font-size:.68em;letter-spacing:.14em;text-transform:uppercase;color:#555;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #1e1e1e">🖼 Imagen</div>
          <small style="color:#555;font-size:.72em;display:block;margin-bottom:8px">Pega una URL de imagen (https://...)</small>
          <input id="e_img" value="${S(a.imagen)}" placeholder="https://ejemplo.com/imagen.jpg" style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.8em;border-radius:3px;outline:none;margin-bottom:8px" oninput="_art.imagen=this.value;document.getElementById('e_imgprev').src=this.value">
          <div style="height:90px;border-radius:3px;overflow:hidden;background:#1a1a1a;display:flex;align-items:center;justify-content:center"><img id="e_imgprev" src="${S(a.imagen)}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover"></div>
        </div>
        <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;padding:14px">
          <div style="font-size:.68em;letter-spacing:.14em;text-transform:uppercase;color:#555;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #1e1e1e">🏷 Tags</div>
          <input id="e_tags" value="${(a.tags||[]).join(', ')}" placeholder="deportes, fútbol, mundial" style="width:100%;box-sizing:border-box;background:#111;border:1px solid #262626;color:#e0dbd0;padding:8px 10px;font-family:inherit;font-size:.8em;border-radius:3px;outline:none" oninput="_art.tags=this.value.split(',').map(t=>t.trim()).filter(Boolean)">
        </div>
        <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;padding:14px">
          <div style="font-size:.68em;letter-spacing:.14em;text-transform:uppercase;color:#555;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #1e1e1e">🔗 Relacionados</div>
          <small style="color:#444;font-size:.72em;display:block;margin-bottom:6px">Ctrl+clic para seleccionar varios</small>
          <select id="e_rel" multiple style="width:100%;height:110px;background:#111;border:1px solid #262626;color:#e0dbd0;padding:6px;font-family:inherit;font-size:.78em;border-radius:3px;outline:none" onchange="_art.relacionados=Array.from(this.selectedOptions).map(o=>Number(o.value))">${opRel}</select>
        </div>
      </div>
    </div>`;
}

function adminGuardar() {
  if(!_art.titulo||!_art.titulo.trim()){rjToast('El titular es obligatorio','err');return;}
  if(!_art.resumen||!_art.resumen.trim()){rjToast('El resumen es obligatorio','err');return;}
  if(!_art.cuerpo||!_art.cuerpo.trim()){rjToast('El cuerpo es obligatorio','err');return;}
  if(!_art.autor||!_art.autor.trim()){rjToast('El autor es obligatorio','err');return;}
  const guardado = dbSave(_art); _art=null; renderHome(); adminLista();
  rjToast('✓ Artículo #'+guardado.id+' guardado.');
}

function adminFmt(t) {
  const ta = document.getElementById('e_cuerpo'); if(!ta) return;
  const sel = ta.value.substring(ta.selectionStart,ta.selectionEnd)||'Texto aquí';
  const map = {p:`<p>${sel}</p>`,h3:`<h3>${sel}</h3>`,bq:`<blockquote>${sel}</blockquote>`,b:`<strong>${sel}</strong>`,i:`<em>${sel}</em>`,ul:`<ul>\n  <li>${sel}</li>\n  <li>Otro</li>\n</ul>`};
  const ins = map[t]||''; const s = ta.selectionStart;
  ta.value = ta.value.substring(0,s)+ins+ta.value.substring(ta.selectionEnd);
  ta.dispatchEvent(new Event('input')); ta.focus();
  ta.selectionStart = ta.selectionEnd = s+ins.length;
}

// ════════════════════════════════════════════════════
//  CARRUSEL DE NOTICIAS
// ════════════════════════════════════════════════════
let _carouselIndex = 0;
function _cardWidth() {
  const t = document.getElementById('allNewsGrid');
  if(!t||!t.children.length) return 242;
  return t.children[0].offsetWidth + 2;
}
function carouselScroll(dir) {
  const track = document.getElementById('allNewsGrid'); if(!track) return;
  const outer = track.parentElement; const cw = _cardWidth();
  const visible = Math.floor(outer.offsetWidth/cw);
  const maxIndex = Math.max(0,track.children.length-visible);
  _carouselIndex = Math.min(Math.max(_carouselIndex+dir,0),maxIndex);
  track.style.transform = 'translateX(-'+(_carouselIndex*cw)+'px)';
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if(prev) prev.style.opacity = _carouselIndex===0?'0.35':'1';
  if(next) next.style.opacity = _carouselIndex>=maxIndex?'0.35':'1';
}

// ════════════════════════════════════════════════════
//  UTILIDADES
// ════════════════════════════════════════════════════
function _hoy() { return new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}); }
let _toastT;
function rjToast(msg, tipo='ok') {
  const t = document.getElementById('rjToast'); t.textContent = msg;
  t.className = tipo==='err'?'show err':'show'; clearTimeout(_toastT);
  _toastT = setTimeout(()=>t.className='', 3200);
}

// ════════════════════════════════════════════════════
//  HLS STREAM LOADER
// ════════════════════════════════════════════════════
function loadStream(audioEl) {
  var url = 'https://streaming.totalmedios.com.co/live/chontico/index.m3u8';
  if (audioEl.canPlayType('application/vnd.apple.mpegurl')) {
    audioEl.src = url; audioEl.load();
  } else if (window.Hls && Hls.isSupported()) {
    if (audioEl._hls) { audioEl._hls.destroy(); }
    var hls = new Hls({ enableWorker: false });
    hls.loadSource(url);
    hls.attachMedia(audioEl);
    audioEl._hls = hls;
  } else {
    audioEl.src = url; audioEl.load();
  }
}

// ════════════════════════════════════════════════════
//  RADIO PLAYER
// ════════════════════════════════════════════════════
// La reproducción de radio auxiliar ha sido eliminada. Solo permanece la señal principal en video.
// ════════════════════════════════════════════════════
//  CSS DE VIDEOS — inyectado dinámicamente
// ════════════════════════════════════════════════════
(function injectVideoCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .rj_vbadge {
      background: var(--c-accent);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 3px;
      letter-spacing: 1px;
      margin-left: 10px;
      vertical-align: middle;
    }
    .rj_vcard {
      flex: 0 0 280px;
      background: #fff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,.10);
      cursor: pointer;
      transition: box-shadow .2s;
    }
    .rj_vcard:hover { box-shadow: 0 4px 16px rgba(0,0,0,.18); }
    .rj_vcard_video {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background: #111;
      overflow: hidden;
    }
    .rj_vcard_thumb {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: opacity .3s;
    }
    .rj_vcard_video.vcard_playing .rj_vcard_thumb        { opacity: 0; pointer-events: none; }
    .rj_vcard_video.vcard_playing .rj_vcard_play_overlay { opacity: 0; pointer-events: none; }
    .rj_vcard_video.vcard_playing iframe                 { opacity: 1 !important; pointer-events: all !important; }
    .rj_vcard_play_overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,.18);
      transition: opacity .2s;
      z-index: 2;
    }
    .rj_vcard_play_btn {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: var(--c-accent);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 12px rgba(0,87,184,.35);
      transition: transform .15s;
    }
    .rj_vcard:hover .rj_vcard_play_btn { transform: scale(1.08); }
    .rj_vcard_play_btn svg { margin-left: 4px; }
    .rj_vcard_body     { padding: 12px 14px 14px; }
    .rj_vcard_cat      { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--c-accent); margin-bottom: 5px; }
    .rj_vcard_title    { font-size: 15px; font-weight: 700; line-height: 1.3; color: #111; margin-bottom: 6px; }
    .rj_vcard_meta     { font-size: 11px; color: #888; margin-bottom: 8px; }
    .rj_vcard_readmore { font-size: 11px; font-weight: 700; letter-spacing: .5px; color: var(--c-accent); text-decoration: none; text-transform: uppercase; }
    .rj_vcard_readmore:hover { text-decoration: underline; }
    .art_video_wrap { margin: 20px 0; }
    .art_video_label { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--c-accent); text-transform: uppercase; margin-bottom: 8px; }
    .art_video_frame { position: relative; padding-top: 56.25%; background: #000; border-radius: 6px; overflow: hidden; }
    .art_video_frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
  `;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════════════
//  SWIPE TÁCTIL — todos los carruseles
// ════════════════════════════════════════════════════
function addSwipe(trackId, scrollFn, suffix) {
  const track = document.getElementById(trackId);
  if (!track) return;
  let startX = 0, startY = 0, locked = null;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    locked = null;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    if (!locked) {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      locked = dx > dy ? 'h' : 'v';
    }
    if (locked === 'h') e.preventDefault();
  }, { passive: false });
  track.addEventListener('touchend', e => {
    if (locked !== 'h') return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    if (suffix !== undefined) scrollFn(diff > 0 ? 1 : -1, suffix);
    else scrollFn(diff > 0 ? 1 : -1);
  }, { passive: true });
}

function initSwipes() {
  addSwipe('allNewsGrid', carouselScroll);
  addSwipe('videoGrid',          videoCarouselScroll, '');
  addSwipe('videoGridNoticias',  videoCarouselScroll, 'Noticias');
  addSwipe('videoGridDeportes',  videoCarouselScroll, 'Deportes');
  addSwipe('videoGridCultura',   videoCarouselScroll, 'Cultura');
  addSwipe('videoGridPolitica',  videoCarouselScroll, 'Politica');
}

// ════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  setTimeout(() => {
    carouselScroll(0);
    initSwipes();
  }, 150);
});