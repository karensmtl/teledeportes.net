# TeleDeportes

Plataforma de streaming deportivo: **VOD** (videos bajo demanda, transcodificados
a múltiples calidades) y **canales de fútbol en vivo** de ultra baja latencia
(WebRTC/WHEP, con estudio web de emisión). Marca: azul `#0074B2`, naranja `#E68526`.

Monorepo con dos aplicaciones conformes a los **TSS (Trianametria Software
Standards)**:

```
teledeportes/
├── teledeportes_server/     Backend — API de control (Node + Express + Sequelize + Postgres)
├── teledeportes_dashboard/  Frontend — sitio público + CMS admin (Vite + React)
└── docs/                    Documentación (ver docs/admin)
```

## Arquitectura

El sistema separa dos planos:

- **Plano de control** (`teledeportes_server`): auth, usuarios/permisos, catálogo
  VOD (categorías y videos), y metadata. **Nunca sirve los bytes de video.**
- **Plano de medios**: el procesamiento y la entrega del video viven fuera de la
  API.
  - **VOD:** al subir un video, se encola un trabajo (**BullMQ/Redis**) y un
    **worker con ffmpeg** lo transcodifica a **HLS** en varias calidades (ABR) +
    miniatura; **nginx** sirve el HLS; el reproductor web usa **hls.js**.
  - **En vivo:** **OvenMediaEngine** ingesta por RTMP/SRT o **WHIP** (estudio web)
    y entrega **WebRTC/WHEP** sub-segundo (fallback LL-HLS). Un *admission webhook*
    valida la clave de transmisión, la reescribe al *slug* público y marca el canal
    "al aire" automáticamente; el reproductor usa **OvenPlayer**.

## Stack

| | Backend | Frontend |
|---|---|---|
| Lenguaje/Runtime | Node 20+ | Node 20+ (build) |
| Framework | Express 5 | React 19 + Vite 7 |
| Datos | Sequelize 6 + Postgres 16 | TanStack Query + axios |
| Otros | Joi, Pino, BullMQ, ffmpeg, OvenMediaEngine | react-router 7, hls.js, ovenplayer, react-hot-toast |

## Requisitos

- **Docker Desktop** (el backend corre 100% en contenedores).
- **Node 20+** y **npm 10+** (para el dev server del frontend).
- En Windows, el sync de los TSS usa **Git Bash** (ver nota más abajo).

## Puesta en marcha

### 1. Backend (dockerizado)

```bash
cd teledeportes_server
cp .env.example .env          # luego edita .env (ver "Variables" abajo)
docker compose up -d --build  # app + worker + db + redis + media-nginx + ome + pgadmin
# Crear esquema y datos iniciales (una vez):
docker compose exec app npm run sync:users
docker compose exec app npm run sync:videos
docker compose exec app npm run sync:channels
docker compose exec app npm run seed:users      # webmaster (de SEED_WEBMASTER_*)
docker compose exec app npm run seed:videos      # categorías por defecto
docker compose exec app npm run seed:channels    # canal demo
```

### 2. Frontend (dev en el host)

```bash
cd teledeportes_dashboard
npm install
cp .env.example .env.local    # VITE_API_ENDPOINT ya apunta al backend local
npm run dev                    # http://localhost:5173 (o 5174 si está ocupado)
```

Entra a `/login` con el usuario webmaster sembrado y llegarás al panel admin.
Guía de uso: **[docs/admin](docs/admin/README.md)**.

## Servicios y puertos (dev)

| Servicio | URL / puerto | Qué es |
|---|---|---|
| API | http://localhost:4000 | Backend (`/api/v1`) |
| Dashboard | http://localhost:5173 | Frontend (sitio + admin) |
| media-nginx | http://localhost:8090 | Sirve el HLS/miniaturas |
| OvenMediaEngine | 1935 (RTMP), 9999 (SRT), 3333 (WebRTC/WHEP/LL-HLS) | Media server en vivo |
| Postgres | localhost:5432 | Base de datos |
| pgAdmin | http://localhost:5050 | Explorador de la BBDD |
| Redis | (interno) | Cola de transcodificación |

## Variables de entorno

Cada app trae su `.env.example` con **todas** las variables. Nunca se commitean
los `.env` reales (están en `.gitignore`).

Para los secretos del backend genera valores fuertes:

```bash
node -e "const c=require('crypto');console.log('JWT_SECRET_PRIMARY='+c.randomBytes(48).toString('base64url'));console.log('TOKEN_PEPPER='+c.randomBytes(32).toString('hex'))"
```

Mínimos a completar en `teledeportes_server/.env`: `DB_PASSWORD`,
`JWT_SECRET_PRIMARY`, `TOKEN_PEPPER`, `SEED_WEBMASTER_EMAIL`,
`SEED_WEBMASTER_PASSWORD`, `OME_ADMISSION_SECRET` (firma del webhook de OME) y
`ALLOWED_ORIGINS` (incluye el origen del frontend).

## Comandos útiles (backend)

```bash
docker compose logs -f app worker   # logs de API + transcodificación
docker compose exec app sh          # shell dentro del contenedor
docker compose restart app          # reiniciar la API
docker compose down                 # detener (los datos persisten)
docker compose down -v              # detener y borrar volúmenes
```

> **Windows:** `bash` por defecto resuelve al WSL (que puede estar roto). Para
> `npm run tss:sync` u otros scripts bash, usa **Git Bash**
> (`C:\Program Files\Git\bin\bash.exe`).

## Estado

| Módulo | Estado |
|---|---|
| Auth + usuarios/permisos | ✅ |
| VOD: categorías + videos (CMS admin) | ✅ |
| VOD: transcodificación (HLS multi-calidad) + reproductor | ✅ |
| Miniaturas personalizadas (videos + canales) | ✅ |
| Sitio público + página de visualización | ✅ |
| En vivo: canales + OvenMediaEngine (RTMP/SRT/WHIP → WebRTC/LL-HLS) | ✅ |
| En vivo: CMS de canales + reproductor `/vivo` | ✅ |
| Estudio web (emitir por WHIP desde el navegador / vMix) | ✅ |
| Multiview (2-3 canales simultáneos) | ⏳ pendiente |
| Producción: HTTPS/TLS, CI/CD, tests, deploy | ⏳ pendiente |

## Estándares

Cada subproyecto se rige por los TSS; las reglas viven en su carpeta `.tts/`
(copia de trabajo, no versionada) y su `CLAUDE.md` documenta el contexto. Las
decisiones de arquitectura quedan en `teledeportes_server/docs/decisions/`.
