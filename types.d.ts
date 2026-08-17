type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    storageData: {
        total: number;
        usage: number;
    };
};

type StaticData = {
    totalStorage: number;
    cpuModel: string;
    totalMemoryGB: number;
};

declare global {
    interface Window {
        electron: {
            subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
            getStaticData: () => Promise<StaticData>;
        };
    }
}

export {};
