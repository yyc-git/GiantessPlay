import { getBlockName } from "../script/Utils"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

// export let getImagePath = (name) => _getPath(name, "png")

export let getUseWaterResourcePath = () => getSoundPath("use_water")

export let getUseWaterResourceId = getUseWaterResourcePath