import { resourceId, resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getConfigData, getName } from "../CityScene"
import { state } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

const _e = new Euler();

export enum modelName {
    ShellTurret,
    MissileTurret,
}

export type modelData = {
    name: modelName,
    resourceId: resourceId,
    resourcePath: string,

    scalar: number,
    quaternion: Quaternion,
}

export let getAllModelData = (): Array<modelData> => {
    return [
        {
            name: modelName.ShellTurret,
            resourceId: getShellTurretResourceId(),
            resourcePath: getShellTurretResourcePath(getName()),

            scalar: 0.2,
            quaternion: new Quaternion(),
        },
        {
            name: modelName.MissileTurret,
            resourceId: getMissileTurretResourceId(),
            resourcePath: getMissileTurretResourcePath(getName()),

            scalar: 5,
            quaternion: new Quaternion(),
        },
    ]
}

export let getModelData = (state: state, modelName) => {
    return NullableUtils.getExn(getConfigData(state).milltaryBuildingData.find(d => d.name == modelName))
}

export let getShellTurretResourceId = () => "shellTurret"

export let getMissileTurretResourceId = () => "missileTurret"

export let getShellTurretResourcePath = (name) => `./resource/${name}/milltary_buildings/${getShellTurretResourceId()}.glb`

export let getMissileTurretResourcePath = (name) => `./resource/${name}/milltary_buildings/${getMissileTurretResourceId()}.glb`

export let getLoadData = () => {
    return [
        {
            id: getShellTurretResourceId(),
            path: getShellTurretResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getMissileTurretResourceId(),
            path: getMissileTurretResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ]
}
