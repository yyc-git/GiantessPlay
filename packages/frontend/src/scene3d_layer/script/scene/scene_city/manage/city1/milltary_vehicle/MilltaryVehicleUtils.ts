import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { readState } from "../../../../../../state/State"
import { getFlameVehicleNamePrefix } from "../soldier/utils/SoldierUtils"

export let getNamePrefix = () => "milltaryVehicle"

export let getNamePrefixFlameVehicle = () => `${getNamePrefix()}_${getFlameVehicleNamePrefix()}`
// export let getNamePrefixFlameVehicle = () => getLanguageTextData(readState(), languageKey.FlameVehicle)


export let isFlameVehicleUtils = (name: string) => {
    return name.includes(getNamePrefixFlameVehicle())
}


export let getNamePrefixMissileVehicle = () => `${getNamePrefix()}_missileVehicle`
// export let getNamePrefixMissileVehicle = () => getLanguageTextData(readState(), languageKey.MissileVehicle)


export let isMissileVehicleUtils = (name: string) => {
    return name.includes(getNamePrefixMissileVehicle())
}


export let getNamePrefixTank = () => `${getNamePrefix()}_tank`
// export let getNamePrefixTank = () => getLanguageTextData(readState(), languageKey.Tank)

export let isTankUtils = (name: string) => {
    return name.includes(getNamePrefixTank())
}


export let isMilltaryVehicle = (name: string) => {
    return isFlameVehicleUtils(name) || isMissileVehicleUtils(name) || isTankUtils(name)
}
