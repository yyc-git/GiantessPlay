import { api } from "type-api/src/Type"
import { soundLevel, soundSetting } from "../Type"

export let getDefaultSoundSetting = (api: api): soundSetting => {
    return {
        giantessSaySoundLevel: soundLevel.Middle,
        pageSoundLevel: soundLevel.Middle,

        sceneSoundLevel: soundLevel.Middle,
    }
}
