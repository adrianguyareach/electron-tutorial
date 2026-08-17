import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import path from 'path';
import { pollResources, getStaticData } from './resourceManager';
import { getAssetPath, getPreloadPath } from './pathResolver';

type test = string;

// Must be module scope: a Tray held only by a local is garbage collected and
// the icon silently disappears from the system tray a while after startup.
let tray: Tray;

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    // build/icon.* is only read by electron-builder when packaging, so without
    // this the window/taskbar shows Electron's default icon in development.
    icon: path.join(getAssetPath(), 'appIcon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: getPreloadPath(),
    },
  });
  // Electron's default menu only binds Ctrl+Shift+I (Cmd+Opt+I on macOS).
  // F12 is a Chrome convention, not an Electron one, so bind it ourselves.
  // Ctrl+Shift+I is deliberately left to the menu -- handling it here too
  // would toggle twice per press and appear to do nothing.
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
  pollResources(mainWindow);
  ipcMain.handle('getStaticData', () => {
    return getStaticData();
  });

  tray = new Tray(path.join(getAssetPath(), 'trayIcon.png'));
  tray.setToolTip('Electron app');
});