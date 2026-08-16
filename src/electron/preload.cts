import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => console.log('get-static-data'),
    subscribeStatistics: () => (callback: (statistics:any) => void) => {},
})