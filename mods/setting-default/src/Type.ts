export enum hdLevel {
    High,
    Middle,
    Low
}

export enum renderAccuracyLevel {
    // MostHigh2,
    // MostHigh,
    VeryHigh,
    High,
    Middle,
    Low
}

export enum shadowLevel {
    High,
    Middle,
    Low
}

export enum maxUnitCount {
    Small,
    Middle,
    Big,
    VeryBig
}

export enum physicsLevel {
    VeryHigh,
    High,
    Middle,
    Low,
    VeryLow
}

// export enum cameraRotateSpeed {
//     VeryHigh = 2,
//     High = 1.5,
//     Middle = 1,
//     Low = 0.7,
//     VeryLow = 0.4
// }

export enum mapSize {
    Small,
    Middle,
    Big,
    // VeryBig,
}

export enum mapSparse {
    Small = 1,
    Middle = 1.5,
    Big = 2,
    VeryBig = 2.5,
}

export type renderSetting = {
    hd: hdLevel,
    renderAccuracy: renderAccuracyLevel,
    shadow: shadowLevel,
    isShowBlood: boolean,
    maxUnitCount: maxUnitCount,
    physics: physicsLevel,

    // cameraRotateSpeed: cameraRotateSpeed,
    mapSize: mapSize,
    mapSparse: mapSparse,

}