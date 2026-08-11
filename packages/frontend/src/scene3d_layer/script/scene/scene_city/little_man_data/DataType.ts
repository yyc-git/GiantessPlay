import { state } from "../../../../type/StateType"
import * as GirlDataType from "../data/DataType"

export enum animatioNameAndActionName {
    Idle = "LittleMan_Idle",

    Run = "LittleMan_Run",
    Shake = "LittleMan_Shake",
    Death = "LittleMan_Death",
    Shoot = "LittleMan_Shoot",
    // Swiping = "LittleMan_Swiping",
    // VeryFastShoot = "LittleMan_VeryFastShoot",

    PickedControlled = "LittleMan_Controlled",

    Lie = "LittleMan_Lie",
    Standup = "LittleMan_Standup",


    ClimbToTop = "LittleMan_ClimbToTop",
    ClimbToDown = "LittleMan_ClimbToDown",
}

// enum extendedAnimationName {
//     // Idle = "LittleMan_Idle",
//     // Walk = "Walk",
// }

export type animationName = animatioNameAndActionName | string
// | extendedAnimationName
// export const animationName = { ...animatioNameAndActionName, ...extendedAnimationName }
export const animationName = animatioNameAndActionName


enum extendedActionName {
    AddGun = "LittleMan_AddGun",

    Reborn = "LittleMan_Reborn",

    Blink = "LittleMan_Blink",

    Lock = "LittleMan_Lock",
}

export type actionName = animatioNameAndActionName | extendedActionName | string
export const actionName = { ...animatioNameAndActionName, ...extendedActionName }


export type track = GirlDataType.track
export const track = { ...GirlDataType.track }

export type animationCollisionData = {
    name: animationName,
    // shapeDamage: Array<collisionPart>,
    timeline: Array<{
        frameIndex?: number,
        // toFrameIndex?: number,
        frameIndices?: Array<number>,
        // frameRange?: [number, number],
        frameRange?: number,
        track: track,
        value: <T> (state: state,
            {
                frameIndex,
                animationName,
                // phase,
                // force
            }: {
                frameIndex: GirlDataType.frameIndex,
                animationName: animationName,
                // phase: phase,
                // force: force
            }
        ) => T
    }>
}


export type animationBlendData<animationName> = Array<{
    condition: (state: state) => boolean,
    // isCurrentAnimationName?: (state: state) => boolean,

    // currentAnimationName?: animationName,
    currentAnimationNames: Array<animationName | string>,
    nextAnimationName: animationName | string,
    weight?: number,
    noBlend?: boolean,
    isOnlyPlayOnce?: boolean,
}>