import { resourceId, resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getConfigData, getName } from "../CityScene"
import { state } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

const _e = new Euler();

export enum modelName {
    Tank,
    MissileVehicle,
    FlameVehicle,
}

export type modelData = {
    name: modelName,
    resourceId: resourceId,
    resourcePath: string,

    scalar: number,
    quaternion: Quaternion,

    boxFactor: nullable<[number, number]>,
}

export let getAllModelData = (): Array<modelData> => {
    return [
        {
            name: modelName.Tank,
            resourceId: getTankResourceId(),
            resourcePath: getTankResourcePath(getName()),

            scalar: 5 * 0.025,
            // quaternion: new Quaternion(),
            quaternion: new Quaternion(-0.707, 0.0, 0, 0.707),

            boxFactor: NullableUtils.return_([4, 2]),
        },
        {
            name: modelName.MissileVehicle,
            resourceId: getMissileVehicleResourceId(),
            resourcePath: getMissileVehicleResourcePath(getName()),

            scalar: 5 * 0.8,
            // quaternion: new Quaternion(0, 0, 0, 1).setFromEuler(_e.set(90 / 180 * Math.PI, -90 / 180 * Math.PI, 0)),
            quaternion: new Quaternion(),

            boxFactor: NullableUtils.getEmpty(),
        },
        {
            name: modelName.FlameVehicle,
            resourceId: getFlameVehicleResourceId(),
            resourcePath: getFlameVehicleResourcePath(getName()),

            // scalar: 5 * 0.8,
            scalar: 5 * 0.03,
            quaternion: new Quaternion(-0.707, 0.0, 0, 0.707),

            boxFactor: NullableUtils.getEmpty(),
        },
    ]
}

export let getModelData = (state: state, modelName) => {
    return NullableUtils.getExn(getConfigData(state).milltaryVehicleData.find(d => d.name == modelName))
}

export let getTankResourceId = () => "tank"

export let getTankResourcePath = (name) => `./resource/${name}/milltary_vehicle/tank/${getTankResourceId()}.glb`


export let getMissileVehicleResourceId = () => "missileVehicle"

export let getMissileVehicleResourcePath = (name) => `./resource/${name}/milltary_vehicle/missile_vehicle/${getMissileVehicleResourceId()}.glb`


export let getFlameVehicleResourceId = () => "flameVehicle"

export let getFlameVehicleResourcePath = (name) => `./resource/${name}/milltary_vehicle/flame_vehicle/${getFlameVehicleResourceId()}.glb`




export let getMissileVehicleMissileResourceId = () => "missileVehicle_missile"

export let getMissileVehicleMissileResourcePath = (name) => `./resource/${name}/milltary_vehicle/missile_vehicle/${getMissileVehicleMissileResourceId()}.glb`


export let getLoadData = () => {
    return [
        {
            id: getTankResourceId(),
            path: getTankResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getMissileVehicleResourceId(),
            path: getMissileVehicleResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getFlameVehicleResourceId(),
            path: getFlameVehicleResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },

        {
            id: getMissileVehicleMissileResourceId(),
            path: getMissileVehicleMissileResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ]
}
