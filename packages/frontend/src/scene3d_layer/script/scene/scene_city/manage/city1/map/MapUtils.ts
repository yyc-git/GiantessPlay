import { mapSparse } from "setting-default/src/Type"
import { getRenderSetting } from "../../../../../../mod/SettingMod"

export let getMapSparseFactor = (state) => {
    let factor
    switch (getRenderSetting(state).mapSparse) {
        case mapSparse.Small:
            factor = 1
            break
        case mapSparse.Middle:
            factor = 1.5
            break
        case mapSparse.Big:
            factor = 2
            break
        case mapSparse.VeryBig:
            factor = 2.5
            break
    }

    return factor
}