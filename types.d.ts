type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    storageData: {
        total: number;
        usage: number;
    };
};

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
        getStaticData: () => void;
    };
}
