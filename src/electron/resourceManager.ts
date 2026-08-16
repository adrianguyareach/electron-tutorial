import osUtil from 'os-utils';
import fs from 'fs';
import os from 'os';
const POLLING_INTERVAL = 500;

export function pollResources() {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = await getRamUsage();
        const storageData = getStorageData();
        // console.log(cpuUsage, ramUsage, storageData);
    }, POLLING_INTERVAL);
}

function getCpuUsage() {
    return new Promise((resolve, reject) => {
        osUtil.cpuUsage(resolve);
    });
}

function getRamUsage() {
    return 1-osUtil.freememPercentage();
}

function getStorageData() {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;

    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free / total,
    };
}

function getStaticData(){
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(os.totalmem() / 1024);
    return {
        totalStorage,
        cpuModel,
        totalMemoryGB,
    };
}