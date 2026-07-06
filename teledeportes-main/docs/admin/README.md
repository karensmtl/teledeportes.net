# Guía del panel de administración — TeleDeportes

Instrucciones para operar el CMS de TeleDeportes desde la interfaz web. Pensado
para quien sube y organiza el contenido (no requiere conocimientos técnicos).

## Contenido

- [Acceso al panel](#acceso-al-panel)
- [El panel de un vistazo](#el-panel-de-un-vistazo)
- [Canales en vivo](canales-en-vivo.md) — transmisiones en directo
- [Estudio web](estudio.md) — emitir desde el navegador (WHIP / vMix)
- [Categorías](categorias.md) — organizar el catálogo
- [Subir videos](subir-videos.md) — cargar y publicar videos

## Acceso al panel

1. Abre el sitio e ingresa a **`/login`** (en desarrollo: `http://localhost:5173/login`).
2. Inicia sesión con tu **correo y contraseña** de administrador.
   - El usuario inicial (webmaster) es el sembrado en el backend
     (`SEED_WEBMASTER_EMAIL` / `SEED_WEBMASTER_PASSWORD` del `.env`).
3. Tras iniciar sesión llegas al **Dashboard** (`/admin`).

Si no tienes permisos para una sección, no la verás en el menú (los botones de
acción también se ocultan según tu rol).

## El panel de un vistazo

El menú lateral izquierdo tiene estas secciones:

| Sección | Para qué sirve |
|---|---|
| **Dashboard** | Resumen: total de videos, listos, procesando y número de categorías + videos recientes. |
| **Canales** | Crear y administrar canales en vivo (clave de transmisión, estado al aire, miniatura). |
| **Estudio** | Salir al aire desde el navegador (cámara, pantalla o cámara virtual de vMix). |
| **Categorías** | Crear y administrar las categorías con las que se organizan los videos. |
| **Videos** | Subir videos, ver su estado de procesamiento y administrarlos. |

Abajo del menú aparece tu nombre y rol, con el botón para **cerrar sesión**.

## Flujos recomendados

**VOD (videos a la carta):**
1. **Crea al menos una categoría** (los videos siempre se asignan a una). → [Categorías](categorias.md)
2. **Sube el video** y elige su categoría. → [Subir videos](subir-videos.md)
3. Espera a que el estado pase a **Listo**: ahí queda publicado y reproducible.

**En vivo:**
1. **Crea un canal** y copia su clave de transmisión. → [Canales en vivo](canales-en-vivo.md)
2. Emite con **OBS/vMix** (RTMP) o desde el **[Estudio web](estudio.md)**.
3. El canal pasa a **EN VIVO** solo y se ve en `/vivo`.

## Roles y permisos

| Rol | Canales / Estudio | Categorías | Videos |
|---|---|---|---|
| **webmaster** | todo | todo | todo |
| **admin** | crear / editar / emitir / eliminar | crear / editar / eliminar | subir / editar / eliminar |
| **technician** | ver / editar / emitir | ver | subir / editar (no eliminar) |
| **owner** | — | — | — |

Las acciones que tu rol no permite simplemente no aparecen en la interfaz.
