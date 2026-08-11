import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { readState } from "../../../../../../state/State"

export let getNamePrefix = () => "millaryBuild#"


export let getNamePrefixMissileTurret = () => `${getNamePrefix()}_missileTurret`
// export let getNamePrefixMissileTurret = () => getLanguageTextData(readState(), languageKey.MissileTurret)


export let isMissileTurretUtils = (name: string) => {
    return name.includes(getNamePrefixMissileTurret())
}

export let getNamePrefixShellTurret = () => `${getNamePrefix()}_shellTurret`
// export let getNamePrefixShellTurret = () => getLanguageTextData(readState(), languageKey.ShellTurret)

export let isShellTurretUtils = (name: string) => {
    return name.includes(getNamePrefixShellTurret())
}


export let isMilltaryBuilding = (name: string) => {
    return isMissileTurretUtils(name) || isShellTurretUtils(name)
}
