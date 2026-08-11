export enum soundLevel {
    // VeryLow = 0.3,
    // Low = 0.7,
    // Middle = 1,
    // High = 1.3,
    // VeryHigh = 1.8

    None = 0,
    VeryLow = 0.2,
    Low = 0.5,
    Middle = 1,
    High = 2,
    VeryHigh = 3
}

export type soundSetting = {
    giantessSaySoundLevel: soundLevel,
    pageSoundLevel: soundLevel,
    sceneSoundLevel: soundLevel,
}