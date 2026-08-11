import { getBlockName } from "../script/Utils"
import { particleType } from "particle-protocol/src/state/StateType"

export let getImagePath = () => `./${getBlockName()}/src/asset/hit.png`

export let getColCount = () => 2

export let getRowCount = () => 7

export let getParticleType = () => particleType.BulletHit
