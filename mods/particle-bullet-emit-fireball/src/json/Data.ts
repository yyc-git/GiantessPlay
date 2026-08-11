import { getBlockName } from "../script/Utils"
import { particleType } from "particle-protocol/src/state/StateType"

export let getImagePath = () => `./${getBlockName()}/src/asset/fireball.png`

export let getParticleType = () => particleType.BulletEmit
