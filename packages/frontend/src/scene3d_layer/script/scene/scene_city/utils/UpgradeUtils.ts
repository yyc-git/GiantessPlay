import { api } from "type-api/src/Type"
import { usedGirlEnum } from "../type/StateType"

export let getUpgradeProtocolName = () => "upgrade-protocol"

let _getLevelByCharacter = (api: api, blockState, usedGirl_) => {
    return api.MutableRecordUtils.getWithDefault(
        blockState.levelMap,
        usedGirl_,
        0
    )
}

export let getGiantessLevel = (api: api, state, usedGirl, upgradeBlockName) => {
    if (usedGirl == usedGirlEnum.None) {
        return 0
    }

    return _getLevelByCharacter(api, api.blockAPI.getBlockState(state, getUpgradeProtocolName(), upgradeBlockName), usedGirl)
}
