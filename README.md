<h1 align="center">
  <a href="https://github.com/pixel-agents-hq/pixel-agents/discussions">
    <img src="webview-ui/public/banner.png" alt="Pixel Agents">
  </a>
</h1>

<h2 align="center">La forma más divertida de orquestar a tus agentes</h2>

<div align="center">

[English](README.en.md) · **Español (Argentina)**

[![version](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpablodelucca%2F3cd28398fa4a2c0a636e1d51d41aee39%2Fraw%2Fversion.json)](https://github.com/pixel-agents-hq/pixel-agents/releases)
[![marketplaces](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpablodelucca%2F3cd28398fa4a2c0a636e1d51d41aee39%2Fraw%2Finstalls.json)](https://marketplace.visualstudio.com/items?itemName=pablodelucca.pixel-agents)
[![npm downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpablodelucca%2F3cd28398fa4a2c0a636e1d51d41aee39%2Fraw%2Fnpm-downloads.json)](https://www.npmjs.com/package/pixel-agents)
[![stars](https://img.shields.io/github/stars/pixel-agents-hq/pixel-agents?logo=github&color=0183ff&style=flat)](https://github.com/pixel-agents-hq/pixel-agents/stargazers)
[![license](https://img.shields.io/github/license/pixel-agents-hq/pixel-agents?color=0183ff&style=flat)](https://github.com/pixel-agents-hq/pixel-agents/blob/main/LICENSE)
[![discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white&style=flat)](https://discord.gg/Yk7jXebv9H)

</div>

<div align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=pablodelucca.pixel-agents">🛒 VS Code Marketplace</a> • <a href="https://open-vsx.org/extension/pablodelucca/pixel-agents">🛒 Open VSX</a> • <a href="https://www.npmjs.com/package/pixel-agents">📦 npm</a> • <a href="https://discord.gg/Yk7jXebv9H">👾 Discord</a> • <a href="https://github.com/pixel-agents-hq/pixel-agents/discussions">💬 Discussions</a> • <a href="CONTRIBUTING.md">🤝 Cómo contribuir</a> • <a href="CHANGELOG.md">📋 Changelog</a>
</div>

<br/>

> **Fork de [@PepeWapo](https://github.com/PepeWapo)** del proyecto [pixel-agents-hq/pixel-agents](https://github.com/pixel-agents-hq/pixel-agents). Esta versión en español y la sección [Cambios de este fork](#cambios-de-este-fork) son propias del fork; el resto del contenido sigue al README original.

Pixel Agents convierte a los agentes de IA que tenés corriendo en tus terminales en personajes pixel art animados que trabajan en una oficina diminuta. Caminan hasta sus escritorios, se sientan, tipean cuando están editando archivos, leen cuando están buscando y te avisan visualmente cuando se quedan esperando una respuesta tuya.

Se distribuye en dos formas desde el mismo código:

- **Extensión de VS Code** — [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=pablodelucca.pixel-agents) y [Open VSX](https://open-vsx.org/extension/pablodelucca/pixel-agents). Los agentes se lanzan en terminales de VS Code y los personajes se dibujan en el panel inferior.
- **CLI standalone** — `npx pixel-agents` levanta un servidor local y sirve la misma oficina como una app de navegador. Sirve para tmux, trabajo remoto y flujos que no usan VS Code.

La arquitectura es totalmente agnóstica al agente y al editor: una interfaz `HookProvider` tipada define el límite de la integración, así que sumar una herramienta de IA nueva es agregar una sola subcarpeta de código. Hoy la implementación de referencia es Claude Code; Codex, Gemini, Cursor y otras están en la hoja de ruta.

![Captura de Pixel Agents](webview-ui/public/office.png)

## Funcionalidades

- **Un agente, un personaje** — cada terminal de Claude Code tiene su propio personaje animado
- **Seguimiento de actividad en vivo** — los personajes se animan según lo que el agente está haciendo de verdad (escribir, leer, ejecutar comandos)
- **Editor de layout de la oficina** — diseñá tu oficina con pisos, paredes y muebles desde un editor integrado
- **Globos de diálogo** — indicadores visuales cuando un agente espera una respuesta o un permiso
- **Notificaciones sonoras** — campanitas opcionales cuando un agente termina su turno o pide permiso
- **Sub-agentes y Agent Teams** — los sub-agentes efímeros y los compañeros persistentes de Claude aparecen como personajes separados, con sus roles y cambios de ciclo de vida
- **Layouts persistentes** — el diseño de tu oficina se guarda y se comparte entre ventanas de VS Code
- **Layout y assets compartidos** — importá y exportá layouts y cargá paquetes externos de personajes, mascotas y muebles
- **Áreas** — pintá áreas con nombre en la oficina, asociá carpetas de trabajo a ellas y los agentes nuevos se sientan dentro de las áreas asociadas a su carpeta
- **Personajes diversos** — 6 personajes distintos, basados en el excelente trabajo de [JIK-A-4, Metro City](https://jik-a-4.itch.io/metrocity-free-topdown-character-pack).

<p align="center">
  <img src="webview-ui/public/characters.png" alt="Personajes de Pixel Agents" width="320" height="72" style="image-rendering: pixelated;">
</p>

## Cambios de este fork

Además de todo lo del proyecto original, este fork agrega:

- **App de escritorio (Electron)** — la carpeta [`desktop/`](desktop/) contiene un envoltorio que corre Pixel Agents como una aplicación de escritorio con ventana propia, sin abrir el navegador.
  - Lanza el servidor standalone (`dist/cli.js`) como proceso hijo, en un **puerto efímero** y solo sobre `127.0.0.1`, con un **token nuevo en cada arranque**.
  - Lee la URL con el token desde la salida del servidor y la carga en la ventana. Como la ventana no tiene barra de direcciones, el **token nunca queda a la vista** ni en el historial de un navegador.
  - Es de **instancia única**: si ya está abierta, un segundo lanzamiento trae la ventana al frente.
  - Recuerda el tamaño y la posición de la ventana.
  - Los links externos se abren en tu navegador; la ventana no puede navegar fuera de la oficina.
  - Al cerrar la ventana se apaga también el servidor.
  - No modifica el código del servidor, así que traer cambios de `upstream` no debería dar conflictos.
- **Acceso directo en el escritorio** — `desktop/create-shortcut.ps1` crea un acceso directo «Pixel Agents» en el escritorio de Windows (con ícono) que abre la app sin mostrar una consola.
- **Build portable opcional** — la configuración de `electron-builder` deja preparado un `.exe` portable para Windows (`npm run dist` dentro de `desktop/`). Está configurado pero no fue probado.

### Usar la app de escritorio

```bash
# desde la raíz del repo: compilar el servidor y el webview
npm install
npm run build

# instalar Electron y abrir la app
cd desktop
npm install
npm start
```

Para crear el acceso directo en el escritorio de Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File desktop\create-shortcut.ps1
```

Para generar el `.exe` portable (queda en `desktop/release/`):

```bash
npm run build
cd desktop
npm run dist
```

> **Nota:** la app usa el `dist/` compilado de la raíz del repo, así que cada vez que cambies el código (propio o ya auditado de `upstream`) acordate de volver a correr `npm run build`.

### Sincronizar con el proyecto original

Este fork **no trae cambios de `upstream` automáticamente**: cada cambio se revisa antes de incorporarlo.

```bash
git remote add upstream https://github.com/pixel-agents-hq/pixel-agents.git   # solo la primera vez
git fetch upstream
git log --oneline main..upstream/main        # qué commits hay de novedad
git diff main...upstream/main                # revisar los cambios antes de integrarlos
```

Si algo de `main` de este fork sirve para el proyecto original, se propone abriendo un pull request a [pixel-agents-hq/pixel-agents](https://github.com/pixel-agents-hq/pixel-agents).

## Hacia dónde va esto

La visión es: jugar un juego, construir un producto. De ahí salen dos objetivos: armar una interfaz familiar e intuitiva para correr y orquestar muchísimos agentes, y lograr que las horas que le dedicás se sientan menos como administración y más como juego.

Más o menos tres etapas nos llevan hasta ahí:

1. **En todos lados, con todo.** Hoy es Claude Code en VS Code o en el navegador. Debería funcionar con el agente que uses, donde trabajes. Una CLI nueva es una subcarpeta, no una reescritura — acá es donde más ayuda se necesita ahora.
2. **Un juego de verdad.** Barras de vida para los límites de uso y los presupuestos de tokens. Puntajes para lo que te importe. Muebles que _hagan_ cosas. Oficinas que abrís como archivos de guardado, una por proyecto.
3. **Ampliar la frontera de la orquestación.** Personajes orquestadores. Armar un equipo arrastrando un recuadro alrededor de ellos. Pasar trabajo de un agente a otro. Apuntarlos a un tablero y dejar que tomen tareas solos.

La mayor parte de esto todavía está por delante. Mirá los [Issues](https://github.com/pixel-agents-hq/pixel-agents/issues) y las [Discussions](https://github.com/pixel-agents-hq/pixel-agents/discussions) para ver qué hay abierto, y [CONTRIBUTING.md](CONTRIBUTING.md) para sumarte.

## Requisitos

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) instalado y configurado
- **Extensión de VS Code:** VS Code 1.105.0 o superior
- **CLI standalone:** Node.js 20 o superior
- Windows, Linux o macOS

## Primeros pasos

### Extensión de VS Code

1. Instalá Pixel Agents desde el [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=pablodelucca.pixel-agents) o desde [Open VSX](https://open-vsx.org/extension/pablodelucca/pixel-agents).
2. Abrí el panel **Pixel Agents** al lado de la terminal.
3. Hacé clic en **+ Agent** para lanzar Claude Code. En un workspace con varias carpetas raíz, elegí primero la carpeta.

Para usar Claude con `--dangerously-skip-permissions`, pasá el mouse por arriba de **+ Agent** y vas a encontrar el botón **Skip permissions mode**. Usalo solo si aceptás las implicancias de seguridad.

Pixel Agents también detecta sesiones de Claude iniciadas fuera de la extensión. Activá **Settings → Watch All Sessions** para incluir sesiones de otros workspaces.

### CLI standalone

Corré Pixel Agents desde el workspace cuyas sesiones de Claude querés ver:

```bash
cd /ruta/a/tu/proyecto
npx pixel-agents
```

La CLI elige un puerto local libre e imprime la URL. El modo standalone no lanza Claude por vos; iniciá Claude Code en una terminal del mismo workspace. Para instalar el comando de forma global:

```bash
npm install --global pixel-agents
pixel-agents
```

Si necesitás una dirección o un puerto fijo:

```bash
pixel-agents --port 3100
pixel-agents --host 127.0.0.1 --port 3100
pixel-agents --help
```

La dirección por defecto es `127.0.0.1`. Si la enlazás a `0.0.0.0`, la UI y el WebSocket quedan expuestos a la red local; hacelo solo en una red de confianza.

Abrí la URL que imprime la CLI: trae un `?token=` propio de esa sesión. Cualquier navegador puede mirar la oficina sin el token, pero instalar o quitar hooks (lo que edita el archivo de configuración de tu herramienta de agentes, como `~/.claude/settings.json`) solo se ofrece a una sesión que tenga el token, así que un cliente sin token en la red no puede aprobarlo. Si abrís la dirección sin el token, el interruptor de hooks en Settings se rechaza y muestra el estado real de la instalación en lugar de aparentar que funcionó.

Tratá esa URL como un secreto: el token es una capacidad al portador (_bearer_), no una prueba de que estás en local. Quien lo tenga puede aprobar la instalación de hooks desde cualquier lugar donde el servidor sea alcanzable, así que no pegues la URL en un canal compartido, y tené en cuenta que además queda en el historial de tu navegador y (sin redactar) en el log de requests del propio servidor.

Pasá `--no-terminal` para deshabilitar la terminal embebida: así mirás a los agentes sin lanzarlos ni conectarte a ellos desde el navegador.

> Si preferís no manejar la URL con token a mano, usá la [app de escritorio de este fork](#cambios-de-este-fork), que la maneja internamente.

### Correr la extensión y el standalone a la vez

La extensión y la CLI standalone pueden correr al mismo tiempo. Cada servidor se registra en `~/.pixel-agents/servers/`; el script de hooks manda los eventos a todos los registros activos. VS Code y standalone mantienen agentes, asientos y configuraciones separados, pero comparten el layout de la oficina.

Para detener un servidor standalone, usá **Ctrl+C**. Solo elimina su propio registro.

## Personalizar la oficina

Hacé clic en **Layout** para editar la oficina:

- Pintá patrones de piso y paredes, con controles de color y contraste.
- Colocá, rotá, recoloreá, seleccioná y eliminá muebles.
- Pintá alfombras con auto-tiling y personalizá sus colores principal y de acento.
- Sumá mascotas animadas; hacé clic en una mascota en la oficina para interactuar con ella.
- Creá **Áreas** con nombre, pintá sus tiles y asignales carpetas de trabajo.
- Deshacé y rehacé cambios, y luego importá o exportá el layout completo como JSON.

Los layouts pueden crecer hasta 64×64 tiles haciendo clic en el borde fantasma que rodea la grilla actual.

### Assets de la oficina

Los muebles, pisos, paredes, alfombras, personajes y mascotas incluidos viven en `webview-ui/public/assets/`. Los manifiestos de muebles describen sprites, grupos de rotación, grupos de estado y cuadros de animación.

Usá **Settings → Add Asset Directory** para cargar personajes, mascotas y muebles externos. Mirá [docs/external-assets.md](docs/external-assets.md) para conocer la estructura de directorios de muebles y los detalles del manifiesto. El administrador visual de assets en `scripts/asset-manager.html` ayuda a crear manifiestos de muebles.

## Cómo funciona

Pixel Agents usa dos caminos para detectar a Claude Code:

- **Modo hooks** (por defecto) — un script de hooks recibe eventos de Claude como `SessionStart`, `PreToolUse`, `PermissionRequest` y `Stop`. Descubre los servidores de Pixel Agents activos y les envía eventos autenticados a cada uno.
- **Modo heurístico** (alternativo) — cuando los hooks no están disponibles, el runtime infiere el estado del agente escaneando los transcripts JSONL de las sesiones de Claude en `~/.claude/projects/`. Los transcripts también se leen en modo hooks para obtener detalles que no vienen en un evento.

El provider de Claude normaliza ambas fuentes en un modelo `AgentEvent` compartido. `AgentRuntime` actualiza el store de estado central y el transporte activo envía mensajes tipados al webview de React. La oficina se renderiza con Canvas 2D, con búsqueda de caminos y máquinas de estado para los personajes.

Pixel Agents no modifica Claude Code. Su configuración de hooks y sus datos persistentes viven en `~/.claude/` y `~/.pixel-agents/` respectivamente.

### Arquitectura

- **`core/`** — contratos de provider, adapter, transporte, esquemas y mensajes AsyncAPI, sin efectos secundarios en runtime.
- **`server/`** — servidor Fastify compartido, runtime de agentes, persistencia, provider de Claude, escaneo de transcripts y la CLI standalone.
- **`adapters/vscode/`** — el adapter de VS Code: terminal, persistencia y puente con el webview.
- **`webview-ui/`** — React 19, Vite, Canvas 2D y transportes específicos para VS Code y para clientes WebSocket en el navegador.
- **`desktop/`** — _(propio de este fork)_ envoltorio Electron que corre el servidor standalone y muestra la oficina en una ventana de escritorio.

La extensión y la CLI se empaquetan con esbuild; el webview se compila con Vite. Los tests unitarios usan Vitest y el test runner de Node, y la cobertura end-to-end usa Playwright contra VS Code y contra standalone.

## Desarrollo

```bash
git clone https://github.com/pixel-agents-hq/pixel-agents.git
cd pixel-agents
npm install
npm run build
```

Presioná **F5** en VS Code para lanzar el Extension Development Host. Para correr el bundle standalone compilado desde el código fuente:

```bash
node dist/cli.js
```

Chequeos habituales:

```bash
npm run check-types
npm run lint
npm test
npm run e2e
```

Mirá [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de desarrollo y [e2e/README.md](e2e/README.md) para la suite end-to-end.

> Los commits pasan por un hook de pre-commit que corre `gitleaks` para escanear secretos, así que necesitás tenerlo instalado (en Windows: `winget install Gitleaks.Gitleaks`).

### Reportes de tests alojados

Generá el reporte combinado de Allure en local y prepará el resultado para Vercel:

```bash
npm run test
npm run e2e
npm run e2e -- --attach-videos-on-success
npm run vercel:prepare
```

Usá `npm run test:report` para generar el reporte combinado sin preparar la salida para Vercel, y después `npm run test:report:open` para servirlo en local.

La salida preparada sirve el reporte combinado de Allure de `e2e`, `server` y `webview` en `/reports/allure/`; no incluye una vista previa standalone del webview. GitHub Actions crea un deploy de Vercel Preview solo para pull requests del mismo repositorio que apunten a `main`. El job de deploy espera los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` y se saltea los pull requests de forks.

## Solución de problemas

- **El standalone no arranca:** verificá que tengas Node.js 20+, omití `--port` para que elija un puerto libre, o elegí otro puerto fijo.
- **Falta un agente:** confirmá que **Settings → Instant Detection (Hooks)** esté activado y que la sesión pertenezca al workspace actual. Activá **Watch All Sessions** si hace falta.
- **La UI parece desconectada:** abrí **Settings → Debug View** para inspeccionar la conexión con el servidor, la ruta del transcript y los últimos datos del agente.
- **La extensión y el standalone están corriendo a la vez:** está soportado. Las versiones actuales crean archivos separados en `~/.pixel-agents/servers/`; detener uno no elimina al otro.
- **La app de escritorio no abre:** verificá que exista `dist/cli.js` (corré `npm run build` en la raíz) y que hayas hecho `npm install` dentro de `desktop/`.

## Comunidad y contribuciones

Sumate al [Discord](https://discord.gg/Yk7jXebv9H) para charlar con otros usuarios y seguir el desarrollo. Usá los [Issues](https://github.com/pixel-agents-hq/pixel-agents/issues) para reportar bugs o pedir funcionalidades, y las [Discussions](https://github.com/pixel-agents-hq/pixel-agents/discussions) para preguntas e ideas.

Leé [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un pull request y nuestro [Código de Conducta](CODE_OF_CONDUCT.md) antes de participar.

## Apoyar el proyecto

<a href="https://github.com/sponsors/pablodelucca">
  <img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?logo=github" alt="GitHub Sponsors">
</a>
<a href="https://ko-fi.com/pablodelucca">
  <img src="https://img.shields.io/badge/Support-Ko--fi-ff5e5b?logo=ko-fi" alt="Ko-fi">
</a>

_(Los enlaces de apoyo corresponden al autor del proyecto original.)_

## Historial de estrellas

<a href="https://www.star-history.com/?repos=pixel-agents-hq%2Fpixel-agents&type=date&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=pixel-agents-hq/pixel-agents&type=date&theme=dark&legend=bottom-right&sealed_token=Vn3YGMuZ_HFZAf56zIUQGCBJDYtDq38sOReKlcxWklxR_ilwVLynb7CPraf5uPhnAU7fwHXXoO88tzLkq9tpEYIExl4N8tcXOmu0ehAXPu5DdXNwjixYsxb00LSfeJ25f_jLkcZcTpRKLKYOb9p4_dR1jjAyrWDs7aicdbqejaDtLcVyj-oSoKkBfrS5" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=pixel-agents-hq/pixel-agents&type=date&legend=bottom-right&sealed_token=Vn3YGMuZ_HFZAf56zIUQGCBJDYtDq38sOReKlcxWklxR_ilwVLynb7CPraf5uPhnAU7fwHXXoO88tzLkq9tpEYIExl4N8tcXOmu0ehAXPu5DdXNwjixYsxb00LSfeJ25f_jLkcZcTpRKLKYOb9p4_dR1jjAyrWDs7aicdbqejaDtLcVyj-oSoKkBfrS5" />
   <img alt="Gráfico de historial de estrellas" src="https://api.star-history.com/chart?repos=pixel-agents-hq/pixel-agents&type=date&legend=bottom-right&sealed_token=Vn3YGMuZ_HFZAf56zIUQGCBJDYtDq38sOReKlcxWklxR_ilwVLynb7CPraf5uPhnAU7fwHXXoO88tzLkq9tpEYIExl4N8tcXOmu0ehAXPu5DdXNwjixYsxb00LSfeJ25f_jLkcZcTpRKLKYOb9p4_dR1jjAyrWDs7aicdbqejaDtLcVyj-oSoKkBfrS5" />
 </picture>
</a>

## Licencia

Pixel Agents está disponible bajo la [Licencia MIT](LICENSE).
