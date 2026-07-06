# Estudio web (emitir desde el navegador)

El **Estudio** permite salir al aire **desde el navegador**, sin instalar nada,
usando WebRTC/WHIP. Es la vía más rápida y de menor latencia (WebRTC en ingesta
y en salida).

Ideal para: un presentador con cámara, compartir pantalla, o **enviar la
producción completa de vMix** a través de su *cámara virtual*.

## Salir al aire

1. Menú lateral → **Estudio** (requiere permiso `channels:write`).
2. Elige el **canal** al que vas a emitir.
3. Elige la **fuente**:
   - **Cámara** → selecciona cámara y micrófono.
   - **Pantalla** → comparte una ventana/pantalla.
4. **Previsualizar** (el navegador pedirá permiso de cámara/micrófono).
5. **Salir al aire** → el canal pasa a **EN VIVO** y se ve en `/vivo`.
6. **Cortar emisión** cuando termines (el canal sale del aire solo).

## Usar vMix (cámara virtual)

1. En vMix, activa **Virtual Camera** (salida de cámara virtual).
2. En el Estudio → fuente **Cámara** → selecciona **"vMix Video"** en la lista.
3. (Audio) selecciona el dispositivo de audio de vMix como micrófono.
4. **Salir al aire**.

Así emites toda tu producción de vMix (escenas, multicámara, marcador, overlays)
con la latencia mínima de WebRTC.

## Requisitos

- **Permiso de cámara/micrófono** en el navegador.
- **Contexto seguro:** funciona en `localhost` (desarrollo). En producción se
  requiere **HTTPS** para que el navegador permita cámara/pantalla.

## Estudio web vs OBS

| | Estudio web (WHIP) | OBS / encoder |
|---|---|---|
| Instalar algo | No | Sí |
| Rapidez para salir al aire | **Máxima** | Media |
| Latencia de ingesta | **Mínima** (WebRTC) | Baja (RTMP) |
| Producción avanzada (escenas, multicámara) | Básica (o vía vMix) | **Completa** |

Ambos métodos funcionan sobre el **mismo canal**; usa el que mejor te sirva en cada momento.

---

Volver al [índice del admin](README.md)
