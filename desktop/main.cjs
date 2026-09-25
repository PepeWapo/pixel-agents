// Desktop shell for Pixel Agents: spawns the standalone server (dist/cli.js) as a
// child process, waits for it to print its tokened URL, and loads that URL in a
// window. The server code is untouched, so merges from upstream stay clean.
const { app, BrowserWindow, shell, dialog } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const URL_PATTERN = /Pixel Agents server running at (http:\/\/[^\s]+)/;
const START_TIMEOUT_MS = 30000;
const DEFAULT_BOUNDS = { width: 1280, height: 800 };

// Packaged: dist is copied to resources/app-dist. Dev: repo-root dist/.
const distDir = app.isPackaged
  ? path.join(process.resourcesPath, 'app-dist')
  : path.join(__dirname, '..', 'dist');
const iconPath = path.join(__dirname, '..', 'icon.png');

let win = null;
let server = null;
let serverOrigin = null;
let quitting = false;

function boundsFile() {
  return path.join(app.getPath('userData'), 'window-bounds.json');
}

function loadBounds() {
  try {
    return { ...DEFAULT_BOUNDS, ...JSON.parse(fs.readFileSync(boundsFile(), 'utf8')) };
  } catch {
    return { ...DEFAULT_BOUNDS };
  }
}

function saveBounds() {
  if (!win || win.isDestroyed() || win.isMinimized()) return;
  try {
    fs.writeFileSync(boundsFile(), JSON.stringify(win.getBounds()));
  } catch (err) {
    console.warn('[Desktop] could not save window bounds:', err.message);
  }
}

/** Start dist/cli.js using Electron's own bundled Node, resolve with the tokened URL. */
function startServer() {
  return new Promise((resolve, reject) => {
    const cli = path.join(distDir, 'cli.js');
    if (!fs.existsSync(cli)) {
      reject(new Error(`No se encontró ${cli}. Corré "npm run build" en la raíz del repo.`));
      return;
    }
    server = spawn(process.execPath, [cli], {
      cwd: os.homedir(),
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
      windowsHide: true,
    });
    let buffer = '';
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('El servidor no arrancó a tiempo.'));
      }
    }, START_TIMEOUT_MS);
    const onData = (chunk) => {
      buffer += chunk.toString();
      const match = URL_PATTERN.exec(buffer);
      if (match && !settled) {
        settled = true;
        clearTimeout(timer);
        resolve(match[1]);
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('error', (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    });
    server.on('exit', (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`El servidor terminó (código ${code}).\n\n${buffer.slice(-800)}`));
      } else if (!quitting) {
        dialog.showErrorBox('Pixel Agents', 'El servidor se detuvo inesperadamente.');
        app.quit();
      }
    });
  });
}

function stopServer() {
  if (server && !server.killed) server.kill();
}

function createWindow(url) {
  const origin = new URL(url).origin;
  serverOrigin = origin;
  win = new BrowserWindow({
    ...loadBounds(),
    title: 'Pixel Agents',
    icon: iconPath,
    // eslint-disable-next-line pixel-agents/no-inline-colors -- matches --pixel-bg; this file is outside the webview
    backgroundColor: '#1e1e2e',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.removeMenu();
  win.on('page-title-updated', (event) => event.preventDefault());

  // The office is the only thing this window may show; anything else opens in the
  // default browser so the tokened session can't be navigated to a third party.
  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:/i.test(target)) shell.openExternal(target);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, target) => {
    if (new URL(target).origin !== serverOrigin) {
      event.preventDefault();
      if (/^https?:/i.test(target)) shell.openExternal(target);
    }
  });

  win.on('resize', saveBounds);
  win.on('move', saveBounds);
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(url);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      createWindow(await startServer());
    } catch (err) {
      dialog.showErrorBox('Pixel Agents', err.message);
      app.quit();
    }
  });

  app.on('window-all-closed', () => app.quit());
  app.on('before-quit', () => {
    quitting = true;
    stopServer();
  });
}
