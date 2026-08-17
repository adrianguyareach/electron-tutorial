import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => ipcRenderer.invoke('getStaticData'),
    subscribeStatistics: (callback: (statistics:any) => void) => {
        ipcRenderer.on('statistics', (event, statistics) => {
            callback(statistics);
        });
    },
} satisfies Window['electron'])