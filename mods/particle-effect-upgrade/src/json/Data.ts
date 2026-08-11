import { getBlockName } from "../script/Utils"
import { particleType } from "particle-protocol/src/state/StateType"

export let getImagePath = () => `./${getBlockName()}/src/asset/effect.png`

export let getColCount = () => 2

export let getRowCount = () => 6

export let getParticleType = () => particleType.Effect
