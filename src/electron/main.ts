import { app, BrowserWindow } from 'electron';
import path from 'path';

type test = string;

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
  
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
});