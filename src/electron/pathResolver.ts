import path from 'path';
import { app } from 'electron';
import { isDev } from './util';

export function getPreloadPath() {
    // Dev: <projectRoot>/dist-electron/preload.cjs, and getAppPath() is the
    // project root. Packaged: extraResources puts the preload at
    // resources/dist-electron/preload.cjs while getAppPath() is
    // resources/app.asar -- hence the '..' hop out of the archive.
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        'dist-electron/preload.cjs'
    );
}
