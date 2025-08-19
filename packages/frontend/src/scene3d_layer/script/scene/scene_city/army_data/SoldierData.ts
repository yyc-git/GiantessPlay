import { resourceId, resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getConfigData, getName } from "../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion } from "three"
import { state } from "../../../../type/StateType"

export enum modelName {
    Infantry,
    Rocketeer,
    Laserer,
    Commander,
    Melee,
}

export type modelData = {
    name: modelName,
    resourceId: resourceId,
    resourcePath: string,

    // quaternion: Quaternion,
    scalar: number,
    // positionYOffset: number,
    positionOffset: [number, number, number],
    // deathPositionYOffset: number,
}

export enum animationName {
    Idle = "Soldier_Idle",

    Run = "Soldier_Run",
    Shake = "Soldier_Shake",
    Death = "Soldier_Death",
    Shoot = "Soldier_Shoot",
    Swiping = "Soldier_Swiping",

    Controlled = "Soldier_Controlled",

    Emit = "Soldier_Emit",
    Pointing = "Soldier_Pointing",
}


export let getAllModelData = (): Array<modelData> => {
    return [
        {
            name: modelName.Infantry,
            resourceId: getInfantryResourceId(),
            resourcePath: getInfantryResourcePath(getName()),

            // quaternion: new Quaternion().setFromEuler(new Euler(
            //     // 3.79 / 180 * Math.PI,
            //     // 5.89 / 180 * Math.PI,
            //     // -147 / 180 * Math.PI,

            //     -9.36 / 180 * Math.PI,
            //     -6.88 / 180 * Math.PI,
            //     -106 / 180 * Math.PI,
            // )),
            // quaternion: new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),

            // quaternion: new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),

            scalar: 0.23,
            positionOffset: [0, 0, 0],
            // scalar: 1,
            // positionYOffset: 420 + 57,
            // deathPositionYOffset: -30 / 100,
            // positionYOffset: 0,
            // deathPositionYOffset: 0,
        },
        {
            name: modelName.Rocketeer,
            resourceId: getRocketeerResourceId(),
            resourcePath: getRocketeerResourcePath(getName()),

            // quaternion: new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),
            // quaternion: new Quaternion().setFromEuler(new Euler(
            //     94.3 / 180 * Math.PI,
            //     // -16.8 / 180 * Math.PI,
            //     0,
            //     -148 / 180 * Math.PI,

            // )),

            // quaternion: new Quaternion(
            //     -0.10303654718644797,
            //     0.7248259135256045,
            //     0.617548255411153,
            //     -0.2874804641437556,
            // ),

            scalar: 0.23 * 0.7,
            positionOffset: [-100, 90, 0],
        },
        {
            name: modelName.Laserer,
            resourceId: getLasererResourceId(),
            resourcePath: getLasererResourcePath(getName()),

            scalar: 0.23 * 0.7,
            positionOffset: [-100, 90, 0],
        },
        {
            name: modelName.Commander,
            resourceId: getCommanderResourceId(),
            resourcePath: getCommanderResourcePath(getName()),

            // quaternion: new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),
            scalar: 1 * 2,
            positionOffset: [0, 0, 0],
            // positionYOffset: 57 + 30,
            // deathPositionYOffset: -30 / 100,
            // positionYOffset: 0,
            // deathPositionYOffset: 0,
        },
        {
            name: modelName.Melee,
            resourceId: getMeleeResourceId(),
            resourcePath: getMeleeResourcePath(getName()),

            // quaternion: new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),
            // quaternion: new Quaternion(),
            // scalar: 0.02,
            scalar: 0.018,
            positionOffset: [0, 0, 0],
            // positionYOffset: 57 + 30,
            // deathPositionYOffset: -30 / 100,
            // positionYOffset: 0,
            // deathPositionYOffset: 0,
        },
    ]
}

export let getModelData = (state: state, modelName) => {
    return NullableUtils.getExn(getConfigData(state).soldierModelData.find(d => d.name == modelName))
}

export let getInfantryResourceId = () => "infantry"

export let getRocketeerResourceId = () => "rocketeer"

export let getLasererResourceId = () => "laserer"

export let getCommanderResourceId = () => "commander"

export let getMeleeResourceId = () => "melee"

export let getInfantryResourcePath = (name) => `./resource/${name}/soldier/infantry/${getInfantryResourceId()}.fbx`

export let getRocketeerResourcePath = (name) => `./resource/${name}/soldier/rocketeer/${getRocketeerResourceId()}.fbx`

export let getLasererResourcePath = (name) => `./resource/${name}/soldier/laserer/${getLasererResourceId()}.fbx`

export let getCommanderResourcePath = (name) => `./resource/${name}/soldier/commander/${getCommanderResourceId()}.fbx`

export let getMeleeResourcePath = (name) => `./resource/${name}/soldier/melee/${getMeleeResourceId()}.fbx`



export let getRocketResourceId = () => "rocket"

export let getRocketResourcePath = (name) => `./resource/${name}/soldier/rocketeer/${getRocketResourceId()}.glb`





export let getIdleAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Idle.fbx`

export let getRunningAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Running.fbx`

export let getShootingAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Shooting.fbx`

export let getDeathAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Death.fbx`

export let getShakeAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Shake.fbx`

export let getControlledAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Controlled.fbx`

export let getEmitAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Emit.fbx`

export let getPointingAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Pointing.fbx`

export let getSwipingAnimationResourcePath = (name) => `./resource/${name}/soldier/animations/Swiping.fbx`

export let getEmitWorkFrameCount = () => 85

export let getSwipingWorkFrameCount = () => 18

export let getPointingWorkFrameCount = () => 10

export let getShootWorkFrameCount = () => 5


export let getLoadData = () => {
    return [
        {
            id: getInfantryResourceId(),
            path: getInfantryResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getRocketeerResourceId(),
            path: getRocketeerResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getLasererResourceId(),
            path: getLasererResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getCommanderResourceId(),
            path: getCommanderResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getMeleeResourceId(),
            path: getMeleeResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ].concat([
        {
            id: getRocketResourceId(),
            path: getRocketResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ]).concat([
        {
            id: animationName.Idle,
            path: getIdleAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Death,
            path: getDeathAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Run,
            path: getRunningAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Shake,
            path: getShakeAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Shoot,
            path: getShootingAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Swiping,
            path: getSwipingAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Controlled,
            path: getControlledAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Emit,
            path: getEmitAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: animationName.Pointing,
            path: getPointingAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ])
}