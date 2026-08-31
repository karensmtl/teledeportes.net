# Canales en vivo

Los canales transmiten **en vivo** con latencia ultra baja (WebRTC). Cada canal
tiene una **clave de transmisión** secreta; cuando un encoder empieza a emitir
con esa clave, el canal pasa a **EN VIVO** automáticamente.

Hay dos formas de emitir a un canal:
- **Encoder externo (OBS, vMix, hardware)** por RTMP — esta guía.
- **Estudio web** (desde el navegador, sin instalar nada) — ver [Estudio](estudio.md).

## Crear un canal

1. Menú lateral → **Canales**.
2. **Nuevo canal** → completa **Nombre**, **Descripción** (opcional) y **Orden**.
3. **Guardar**. Se genera una **clave de transmisión** única.

## Emitir con OBS (u otro encoder RTMP)

1. En la lista de canales, usa **Copiar clave** y **Copiar RTMP** (el ojo 👁 revela la clave).
2. En OBS → *Ajustes → Emisión*:
   - **Servicio:** Personalizado
   - **Servidor:** `rtmp://localhost:1935/app`
   - **Clave de retransmisión:** la clave del canal
3. *Iniciar transmisión*. El canal pasa a **EN VIVO** solo y se ve en `/vivo`.

> Desde otra máquina/estadio se usa la IP o dominio público del servidor en vez
> de `localhost`, con el puerto **1935** (RTMP) o **9999** (SRT) accesible.

## Estado "al aire"

- Se actualiza **automáticamente** al iniciar/cortar la emisión.
- También puedes forzarlo con **Poner al aire / Sacar del aire** (útil para pruebas o cortes manuales).
- La lista se refresca sola; no necesitas recargar.

## Miniatura del canal

En la fila del canal → **Miniatura** → elige una imagen (JPG/PNG/WEBP, ≤ 8 MB).
Se muestra en la página pública `/vivo` y en la lista del admin. Si no subes una,
se muestra el logo del canal (ver abajo).

## Logo del canal

En la fila del canal → **Subir logo** → elige una imagen **PNG, WEBP o AVIF con
transparencia** (≤ 2 MB). JPG se rechaza a propósito: se vería como un recuadro
opaco encima del video.

El logo es la identidad visual del canal: reemplaza al nombre en el **hero de la
portada** (el nombre queda debajo, en letra pequeña) y en las tarjetas de `/vivo`
cuando el canal no tiene miniatura. Si el canal no tiene logo, se usa el nombre
como marca denominativa, así que la portada nunca queda vacía.

- La columna **Logo** de la lista muestra el logo sobre un damero para que veas
  si de verdad tiene transparencia.
- **Cambiar logo** reemplaza el anterior (y borra el archivo viejo del disco).
- **Quitar logo** vuelve a mostrar el nombre.

> Recomendación: logo horizontal, alto ≥ 128 px, con márgenes mínimos. En el hero
> se escala a 128 px de alto como máximo.

## Ver el canal

- **Todos los canales:** `/vivo`
- **Un canal:** `/vivo/<slug>` (o el botón **Ver** en la lista del admin).

El reproductor usa WebRTC (sub-segundo) con fallback a LL-HLS.

## Seguridad de la clave

La clave de transmisión es **secreta**: quien la tenga puede emitir en ese canal.
El sistema la mantiene oculta del público (la URL pública usa el *slug*, no la clave).
No la compartas fuera del equipo de producción.

---

Siguiente: [Estudio web →](estudio.md)
