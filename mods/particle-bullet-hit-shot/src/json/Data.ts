import { getBlockName } from "../script/Utils"
import { particleType } from "particle-protocol/src/state/StateType"

export let getImagePath = () => `./${getBlockName()}/src/asset/bulletHit.png`

export let getColCount = () => 6

export let getRowCount = () => 1

export let getParticleType = () => particleType.BulletHit
