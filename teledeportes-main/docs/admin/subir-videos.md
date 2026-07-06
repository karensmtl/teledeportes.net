# Subir videos

Cómo cargar un video, qué pasa después y cómo administrarlo desde la sección
**Videos** del panel.

## Antes de empezar

- Debes tener **al menos una categoría** creada. → [Categorías](categorias.md)
- Necesitas permiso `videos:write` (roles *webmaster*, *admin* o *technician*).
  Si no ves el botón **Subir video**, tu usuario no tiene ese permiso.

## Subir un video paso a paso

1. En el menú lateral entra a **Videos**.
2. Haz clic en **Subir video** (arriba a la derecha).
3. En la ventana que se abre:
   - **Archivo** — arrastra el video al recuadro o haz clic para elegirlo.
     Al seleccionarlo verás su nombre y tamaño, y el recuadro se pone verde.
   - **Título** — se completa solo con el nombre del archivo; ajústalo a gusto.
   - **Categoría** *(obligatorio)* — elígela de la lista.
   - **Descripción** *(opcional)*.
4. Haz clic en **Subir**. Verás una **barra de progreso** con el porcentaje.
   No cierres la ventana hasta que termine la carga.
5. Al terminar, el video aparece en la grilla con el estado **En cola** y
   empieza a procesarse automáticamente.

## Estados del video

Cada video pasa por estos estados (se ven como una etiqueta de color en su tarjeta):

| Estado | Significado |
|---|---|
| **En cola** | Subido; esperando turno para procesarse. |
| **Procesando** | Generando las distintas calidades y la miniatura. |
| **Listo** | Procesado y **publicado**: ya se reproduce en el sitio. |
| **Falló** | Hubo un error al procesar (ver *Solución de problemas*). |

La lista **se actualiza sola cada pocos segundos** mientras haya videos
procesándose: no necesitas refrescar la página.

### ¿Qué hace el procesamiento?

Al subir, el sistema transcodifica el video a **varias calidades** para que se
reproduzca fluido según la conexión de cada espectador (adaptación automática),
genera una **miniatura** y calcula la **duración**. Las calidades dependen de la
resolución del original:

- **360p** — siempre.
- **720p** — si el original es de 720p o más.
- **1080p** — si el original es de 1080p o más.

No se "agranda" un video de baja calidad; solo se generan las calidades que el
original permite.

## Cuando el video está "Listo"

- Aparece automáticamente en la **página de inicio** (sección *Videos*).
- Es reproducible en su página de visualización con el reproductor (calidad,
  velocidad, pantalla completa, etc.).

## Administrar videos

En cada tarjeta de la grilla:

- **Miniatura** — sube una imagen propia (JPG/PNG/WEBP, ≤ 8 MB) que reemplaza a
  la miniatura generada automáticamente. Se conserva aunque reproceses el video.
- **Reprocesar** — vuelve a generar las calidades. Aparece cuando el video
  **Falló**; úsalo tras corregir el problema.
- **Eliminar** — quita el video del catálogo (requiere permiso `videos:admin`).

Arriba puedes **filtrar por categoría** con el selector.

## Recomendaciones

- Sube el **mejor original disponible** (idealmente 1080p) para obtener todas las
  calidades.
- Formatos aceptados: cualquier archivo de **video** (`mp4`, `mov`, `mkv`, etc.).
- Tamaño máximo por archivo: definido por el servidor (por defecto **5 GB**).
- El tiempo de procesamiento depende de la **duración y el tamaño**; videos
  largos tardan más en quedar *Listos*.

## Solución de problemas

| Síntoma | Qué hacer |
|---|---|
| No veo el botón **Subir video** | Tu rol no tiene `videos:write`. Pide acceso. |
| La carga falla de inmediato | Revisa que el archivo sea un video y no supere el tamaño máximo. |
| El video queda en **Falló** | Usa **Reprocesar**. Si persiste, el archivo puede estar corrupto o en un formato no soportado; vuelve a exportarlo (mp4 H.264) y súbelo de nuevo. |
| No aparece en la página de inicio | Solo se publican los videos en estado **Listo**. Espera a que termine de procesar. |
| Quedó **Procesando** mucho tiempo | Los videos largos tardan; si lleva demasiado, usa **Reprocesar**. |

---

Volver al [índice del admin](README.md)
