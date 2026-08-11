import { getBlockName } from "../script/Utils"
import { particleType } from "particle-protocol/src/state/StateType"

export let getImagePath = () => `./${getBlockName()}/src/asset/fireballHit.png`

export let getColCount = () => 4

export let getRowCount = () => 4

export let getParticleType = () => particleType.BulletHit
