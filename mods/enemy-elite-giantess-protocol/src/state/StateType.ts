import { resourceId } from "type-api/src/Type";

export type modelData = {
    // name: modelName,
    resourceId: resourceId,
    resourcePath: string,

    // quaternion: Quaternion,
    scalar: number,
    // positionYOffset: number,
    positionOffset: [number, number, number],
    // deathPositionYOffset: number,
}


// type categoryName = string

export type state = null



