import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => console.log('get-static-data'),
    subscribeStatistics: (callback: (statistics:any) => void) => {
        ipcRenderer.on('statistics', (event, statistics) => {
            callback(statistics);
        });
    },
})