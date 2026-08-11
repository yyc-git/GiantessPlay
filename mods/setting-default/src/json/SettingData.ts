import { api } from "type-api/src/Type"
import { maxUnitCount, hdLevel, mapSize, mapSparse, physicsLevel, renderAccuracyLevel, renderSetting, shadowLevel } from "../Type"

export let getDefaultRenderSetting = (api: api): renderSetting => {
    return {
        hd: hdLevel.High,
        shadow: api.Device.isMobile() ? shadowLevel.Middle : shadowLevel.High,
        renderAccuracy: api.Device.isMobile() ? renderAccuracyLevel.Middle : renderAccuracyLevel.High,
        isShowBlood: false,
        maxUnitCount: api.Device.isMobile() ? maxUnitCount.Middle : maxUnitCount.Big,
        physics: api.Device.isMobile() ? physicsLevel.Middle : physicsLevel.High,

        // cameraRotateSpeed: cameraRotateSpeed.Middle,
        mapSize: mapSize.Small,
        mapSparse: mapSparse.Middle,
    }
}
