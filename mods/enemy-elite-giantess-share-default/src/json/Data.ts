import { animationName } from "enemy-elite-giantess-share-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getWalkResourceId = () => "walk"

export let getStompLightWorkFrameCount = () => 38

export let getStompHeavyWorkFrameCount = () => 44

export let getKickLightWorkFrameCount = () => 38

export let getMagicAttack1WorkFrameCount = () => 20

export let getMoveWorkFrameCount = () => 12

// export let getMoveWorkFrameCount2 = () => 25

let _getPath = (name) => `./${getBlockName()}/src/asset/${name}.fbx`

export let getIdleData = () => [animationName.Idle, _getPath("Idle")]

export let getDeathData = () => [animationName.Death, _getPath("Death")]

export let getDeathHeadshotData = () => [animationName.DeathHeadshot, _getPath("DeathHeadshot")]

export let getWalkData = () => [animationName.Walk, _getPath("Walk")]

export let getShakeData = () => [animationName.Shake, _getPath("Shake")]

export let getStompLightData = () => [animationName.StompLight, _getPath("StompLight")]

export let getStompHeavyData = () => [animationName.StompHeavy, _getPath("StompHeavy")]

export let getKickLightData = () => [animationName.KickLight, _getPath("KickLight")]

export let getMagicAttack1Data = () => [animationName.MagicAttack1, _getPath("MagicAttack1")]

export let getPickedControlledData = () => [animationName.PickedControlled, _getPath("PickedControlled")]

export let getLieData = () => [animationName.Lie, _getPath("Lie")]

export let getStandupFromLieData = () => [animationName.StandupFromLie, _getPath("StandupFromLie")]
