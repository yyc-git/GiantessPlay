import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { field, service } from "interaction-protocol/src/service/ServiceType"
import { state } from "interaction-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { createState, getBlockName, getProtocolName, setCostFactor, setFieldValue, setState } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { getWeaponGirlMapResourceId, getInteractionConfig, getLoadResourceIdData, getName, getTriggerData, getWeaponData } from "./json/Data"
import { trigger } from "./script/Trigger"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        init: (api: api, state) => {
            state = bindEvent(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            state = unbindEvent(api, state)

            // state = setState(api, state, createState(api))

            return Promise.resolve(state)
        },


        getName: getName,
        getLoadResourceIdData: getLoadResourceIdData,
        getInteractionConfig: getInteractionConfig,
        getMapResourceId: getWeaponGirlMapResourceId,
        getTriggerData: getTriggerData,

        trigger: trigger,

        custom: {
            setBulletSpeedMax: (api: api, state, weaponName) => {
                let { fields } = api.NullableUtils.getExn(getWeaponData(api, state).find(data => data.name == weaponName))

                let fieldName = field.emitterSpeed

                let { maxValue } = api.NullableUtils.getExn(fields.find(f => f.name == fieldName))

                return setFieldValue(api, state, weaponName, fieldName, maxValue)
                // return setFieldValue(api, state, weaponName, fieldName, maxValue + 1)
            },
            setBulletSpeedMin: (api: api, state, weaponName) => {
                let { fields } = api.NullableUtils.getExn(getWeaponData(api, state).find(data => data.name == weaponName))

                let fieldName = field.emitterSpeed

                return setFieldValue(api, state, weaponName, fieldName, 0)
            },
            setCostFactor: setCostFactor
        }
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api) => {
    return createState(api)
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "互动->武器女神",
            author: "官方",
            category: "互动",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Interaction->Weapon Girl",
        author: "Author",
        category: "Interaction",
        version: "0.0.1",
    }
}