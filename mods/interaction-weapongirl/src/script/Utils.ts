import { blockName } from "block/src/BlockManagerType"
import { weaponSingleData } from "interaction-protocol/src/service/ServiceType"
import { state } from "interaction-protocol/src/state/StateType"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "interaction-protocol"

export let getBlockName = () => "interaction-weapongirl"

export let getPropBulletProtocolName = () => "prop-bullet-protocol"

export let getPropBasicBulletBlockName = () => "prop-bullet-basic"

export let getPropSubmachineBulletBlockName = () => "prop-bullet-submachine"

export let getPropShotBulletBlockName = () => "prop-bullet-shot"

export let createState = (api: api): state => {
    return {
        upgradedMap: api.MutableRecordUtils.create(),
        weaponData: Array<weaponSingleData>,
        costFactor: 1,
    }
}

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<state>(state, getProtocolName(), getBlockName())
}

export let setState = (api: api, state, blockState) => {
    return api.blockAPI.setBlockState<state>(state, getProtocolName(), getBlockName(), blockState)
}

export let getFieldValue = (api: api, state, weaponName, fieldName) => {
    return api.MutableRecordUtils.getWithDefault(
        api.MutableRecordUtils.getWithDefault(
            getState(api, state).upgradedMap,
            weaponName,
            0
        ),
        fieldName,
        0
    )
}

export let setFieldValue = (api: api, state, weaponName, fieldName, fieldValue) => {
    return setState(api, state, {
        ...getState(api, state),
        upgradedMap: api.MutableRecordUtils.set(
            getState(api, state).upgradedMap,
            weaponName,
            api.MutableRecordUtils.set(
                api.MutableRecordUtils.getWithDefault(
                    getState(api, state).upgradedMap,
                    weaponName,
                    api.MutableRecordUtils.create()
                ),
                fieldName,
                fieldValue
            )
        )
    })
}

export let getWeaponData = (api: api, state) => {
    return getState(api, state).weaponData
}

export let setWeaponData = (api: api, state, data) => {
    return setState(api, state, {
        ...getState(api, state),
        weaponData: data
    })
}

export let getCostFactor = (api: api, state) => {
    return getState(api, state).costFactor
}

export let setCostFactor = (api: api, state, data) => {
    return setState(api, state, {
        ...getState(api, state),
        costFactor: data
    })
}