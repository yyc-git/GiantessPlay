import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBlockName, getProtocolName, getSettingProtocolName, getSettingSoundBlockName } from "./Utils"
import { state } from "sound-background-protocol/src/state/StateType"
import { state as settingState } from "setting-protocol/src/state/StateType"
import { soundSetting } from "setting-sound/src/Type"

let _getIndexSound1ResourceId = () => "background1"
let _getIndexSound2ResourceId = () => "background2"
let _getIndexSound3ResourceId = () => "background3"
let _getIndexSound4ResourceId = () => "background4"
let _getIndexSound5ResourceId = () => "background5"

let _getModPrefix = () => "./sound-background-default/src/asset"

let _getAllResourceIds = () => [
    _getIndexSound1ResourceId(),
    _getIndexSound2ResourceId(),
    _getIndexSound3ResourceId(),
    _getIndexSound4ResourceId(),
    _getIndexSound5ResourceId(),
]

let _loadWholeResourceHandler = (api: api, state, _) => {
    let loadedPlayingResourceId = api.NumberUtils.randomSelect(_getAllResourceIds())

    state = api.blockAPI.setBlockState<state>(state,
        getProtocolName(),
        getBlockName(),
        {
            ...api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()),
            loadedPlayingResourceId: api.NullableUtils.return_(loadedPlayingResourceId)
        }
    )

    state = api.load.addResourceData(state,
        [{
            id: loadedPlayingResourceId,
            path: [`${_getModPrefix()}/${loadedPlayingResourceId}.mp3`],
            type: resourceType.Audio
        }]
    )

    return Promise.resolve(state)
}

let _playIndexSoundHandler = (api: api, _) => {
    let state = api.readState()

    let resourceId = api.NullableUtils.getExn(api.blockAPI.getBlockState<state>(state, getProtocolName(), getBlockName()).loadedPlayingResourceId)

    state = api.blockAPI.setBlockState<state>(state,
        getProtocolName(),
        getBlockName(),
        {
            ...api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()),
            playingResourceId: api.NullableUtils.return_(resourceId)
        }
    )

    let { pageSoundLevel } = (api.blockAPI.getBlockState<settingState>(state, getSettingProtocolName(), getSettingSoundBlockName()).setting as soundSetting)

    state = api.sound.play(state, {
        resourceId: resourceId,
        volume: 0.5 * pageSoundLevel,
        isLoop: true
    })

    api.writeState(state)

    return Promise.resolve()
}

let _stopIndexSoundHandler = (api: api, state, _) => {
    if (api.NullableUtils.isNullable(api.blockAPI.getBlockState<state>(state, getProtocolName(), getBlockName()).playingResourceId)) {
        return Promise.resolve(state)
    }

    state = api.sound.stop(state, api.NullableUtils.getExn(api.blockAPI.getBlockState<state>(state, getProtocolName(), getBlockName()).playingResourceId))

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadWholeResourceEventName(), _loadWholeResourceHandler)
    state = api.event.onByReadWriteState(state, api.event.getPlayIndexSoundEventName(), _playIndexSoundHandler)
    state = api.event.on(state, api.event.getStopIndexSoundEventName(), _stopIndexSoundHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    // state = api.event.off(state, api.event.getLoadWholeResourceEventName(), _loadWholeResourceHandler)
    // state = api.event.off(state, api.event.getPlayIndexSoundEventName(), _playIndexSoundHandler)
    // state = api.event.off(state, api.event.getStopIndexSoundEventName(), _stopIndexSoundHandler)
    state = api.event.offAll(state, api.event.getLoadWholeResourceEventName())
    state = api.event.offAll(state, api.event.getPlayIndexSoundEventName())
    state = api.event.offAll(state, api.event.getStopIndexSoundEventName())

    return state
}
