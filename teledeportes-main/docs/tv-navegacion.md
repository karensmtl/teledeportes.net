# Navegación por control remoto (D-pad)

El sitio público está pensado también para **pantalla de TV**: se puede recorrer
entero con el pad direccional de un control remoto, sin ratón ni pantalla táctil.

## Teclas

| Tecla | Acción |
|---|---|
| ↑ ↓ ← → | Mueve el foco al elemento más cercano en esa dirección |
| **OK / Enter** | Activa el elemento enfocado (abrir nota, reproducir, ir al canal) |
| **BACK / RETURN** | Vuelve a la pantalla anterior (si no hay historial, va a la portada) |

Se mapean tanto los `key` estándar como los `keyCode` propietarios de los
navegadores de TV: **LG webOS** (BACK = `461`), **Samsung Tizen** (BACK = `10009`,
OK = `29443`), Android TV / Chromecast y sticks HbbTV. En un teclado normal
funcionan las flechas, Enter y Escape.

## Cómo funciona

El foco es **espacial**, no por orden del DOM: al pulsar una flecha se calcula,
con la geometría real en pantalla, cuál es el elemento más cercano en esa
dirección (`src/features/tv/utils/spatial.js`). Por eso recorrer una fila de
tarjetas se siente natural aunque en el HTML estén anidadas de otra forma.

- El elemento enfocado **siempre se lleva a la vista** (`scrollIntoView`) y se
  resalta con un anillo naranja grueso, legible a tres metros.
- El modo TV se **activa solo** en navegadores de televisor (por *user agent*) y,
  en cualquier otro dispositivo, en cuanto se pulsa una flecha u OK. Al usar el
  ratón el anillo desaparece: no molesta a quien navega desde un computador.
- Al cambiar de pantalla el foco pasa al primer elemento de la nueva vista, para
  que el control remoto nunca se quede "sin nada seleccionado".
- Dentro de un campo de texto las flechas mueven el cursor, no el foco.

## Hacer enfocable un elemento nuevo

Los enlaces, botones y campos se detectan solos. Un contenedor clicable
(un `<div onClick>`) hay que marcarlo:

```jsx
<div className="mi_tarjeta" onClick={abrir} role="button" tabIndex={0} data-tv-focusable>
```

Con `data-tv-focusable` basta para que el D-pad lo alcance y para que **OK**
dispare su `onClick`; `role="button"` y `tabIndex` lo dejan además accesible por
teclado y para lectores de pantalla.

## Dónde vive

```
teledeportes_dashboard/src/
├── core/constants/tv.js                  Mapa de teclas (incluye keyCodes de TV)
└── features/tv/
    ├── contexts/tv-navigation.jsx        Provider + hook useTvNavigation()
    ├── utils/spatial.js                  Resolución geométrica del foco
    └── styles/tv.css                     Anillo de foco y realce de tarjetas
```

El provider se monta una sola vez en `src/app/app.jsx`, así que cubre tanto el
sitio público como el CMS admin.
