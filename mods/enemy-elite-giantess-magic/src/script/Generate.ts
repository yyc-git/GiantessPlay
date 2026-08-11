import { api } from "type-api/src/Type"
import { buildCategoryName } from "./Event"
import { getModelQueue, getShareBlockName, getShareProtocolName } from "./Utils"
import { getModelData } from "../json/Data"
import { getValue } from "../json/Data"
import { createInitialState } from "./FSMState"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";

// export let generateEliteGiantesses = (api: api, value: armyValue & eliteGiantessValue) => {
export let generateEliteGiantesses = (api: api) => {
    return (state,
        [
            getMaxVisibleCountFunc,
            getCrowdCountFunc,
            getOffsetFactorFunc,
        ],
        crowdPositions,
        // factor, camp_ = camp.Enemy) => {
        factor, camp_) => {
        return api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).generateEliteGiantesses
            (
                api,
                state, [
                getMaxVisibleCountFunc,
                getCrowdCountFunc,
                getOffsetFactorFunc,
                buildCategoryName,
                // initialAttributesMeleeGiantess,
                createInitialState,
            ],
                factor,
                getModelData(),
                buildCategoryName(api, state),
                getModelQueue(api, state),
                camp_,

                crowdPositions,

                // scale,
                getValue(api, state)
            )
    }
}