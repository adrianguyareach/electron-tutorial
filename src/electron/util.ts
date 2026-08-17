import { app, ipcMain } from 'electron';

export function isDev(): boolean {
    // NODE_ENV is not set by the dev script, so keying off it always returned
    // false. app.isPackaged is set by Electron itself and needs no env var.
    return !app.isPackaged;
}

function ipcHandle<Key extends string>(key: Key, handler: () => any) {
    ipcMain.handle(key, () => handler());
}