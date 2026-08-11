import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../scene3d_layer/type/StateType"
import { bossStatus, giantessStatus, levelStatus, littleManStatus, missionComplete, skillStatus } from "../index/scene/store/SceneStoreType"
import * as LittleMan from "../../scene3d_layer/script/scene/scene_city/little_man/LittleMan"
import { getBiggerRemainTime, getFullBiggerTime } from "../../scene3d_layer/script/scene/scene_city/girl/InitWhenImportScene"
import { getExcitement, getFullExcitement, getFullHp, getHp, getFullHpByDamagePart, buildNameByUsedGirl } from "../../scene3d_layer/script/scene/scene_city/girl/Girl"
import { damagePart, damageType, usedGirlEnum } from "../../scene3d_layer/script/scene/scene_city/type/StateType"
import { mmdCharacter } from "../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData"
import { getLifeCount } from "../../scene3d_layer/script/scene/scene_city/StaticDynamic"
import { computeHeight } from "../../scene3d_layer/script/scene/scene_city/girl/Utils"

// let getLittleManCharaterTypeGiantessBarWidth = () => 20
// let _getGiantessBarWidth = () => 20
// let _getGiantessBarWidth = () => 14

// export let getOtherBarWidth = () => 10
export let getOtherBarWidth = () => 8
// export let getOtherBarWidth = () => 6

let _computeBarStyle = (value, defaultWidth, fullValue, widthFactor = 1) => {
	let width = defaultWidth * widthFactor * NumberUtils.getDecimal(value / fullValue, 2)
	// let left = (_getWidth() - width) / 2
	// let marginLeft = width > _getWidth() / 2 ? _getWidth() - width : _getWidth() / 2

	return {
		"width": `${width}rem`
		// "left": `-${left}rem`
		// "margin-left": `-${marginLeft}rem`
	}
}

let _computeHpBarStyle = (state: state, defaultWidth, hp, fullHp) => {
	return _computeBarStyle(hp, defaultWidth, fullHp)
}

let _computeExcitementBarStyle = (state: state, usedGirl, defaultWidth) => {
	return _computeBarStyle(getExcitement(state, usedGirl), defaultWidth, getFullExcitement(state, usedGirl, buildNameByUsedGirl(usedGirl)))
}

// export let buildBossStatus = (state: state, damagePart: damagePart, name: mmdCharacter, usedGirl): bossStatus => {
export let buildBossStatus = (state: state, dataArr): bossStatus => {
	let barWidth
	if (dataArr.length == 1) {
		barWidth = 14
	}
	else if (dataArr.length > 1) {
		// barWidth = 9.3
		barWidth = 8.2
	}
	else {
		barWidth = 0
	}

	return dataArr.map(([
		damagePart, name, usedGirl
	]) => {
		let fullHp = getFullHpByDamagePart(state, usedGirl, damagePart)
		let hp = getHp(state, usedGirl, damagePart)

		return {
			target: damagePart,
			name,

			hpStyle: _computeHpBarStyle(state, barWidth, hp, fullHp),
			hp: Math.floor(hp),
			fullHp: fullHp,

			height: computeHeight(state, usedGirl),

			usedGirl,

			// excitementStyle: _computeExcitementBarStyle(state, defaultWidth),
			// excitement: Math.floor(getExcitement(state, usedGirl)),
			// fullExcitement: getFullExcitement(state, getName())
		}
	})
}

export let buildGiantessStatus = (state: state, usedGirl, defaultWidth: number, damagePart: damagePart): giantessStatus => {
	// let usedGirl = usedGirlEnum.PlayerGirl

	let fullHp = getFullHpByDamagePart(state, usedGirl, damagePart)
	let hp = getHp(state, usedGirl, damagePart)

	return {
		target: damagePart,

		hpStyle: _computeHpBarStyle(state, defaultWidth, hp, fullHp),
		hp: Math.floor(hp),
		fullHp: fullHp,

		excitementStyle: _computeExcitementBarStyle(state, usedGirl, defaultWidth),
		excitement: Math.floor(getExcitement(state, usedGirl)),
		fullExcitement: getFullExcitement(state, usedGirl, buildNameByUsedGirl(usedGirl)),

		lifeCount: getLifeCount(state)
	}
}


let _computeSkillBarStyle = (state: state, usedGirl) => {
	return _computeBarStyle(getBiggerRemainTime(state, usedGirl), getOtherBarWidth(), getFullBiggerTime(state, usedGirl), 0.97)
}

export let buildSkillStatus = (state: state, usedGirl): skillStatus => {
	return {
		skillStyle: _computeSkillBarStyle(state, usedGirl),
		value: Math.floor(getBiggerRemainTime(state, usedGirl)),
		fullValue: getFullBiggerTime(state, usedGirl),
	}
}

// export let buildLevelStatus = (height, destroyedRate): levelStatus => {
// 	return {
// 		height, destroyedRate
// 	}
// }

export let buildLittleManStatus = (state: state, defaultWidth): littleManStatus => {
	return {
		hpStyle: _computeHpBarStyle(state, defaultWidth, LittleMan.getHp(state), LittleMan.getFullHp(state)),
		hp: Math.floor(LittleMan.getHp(state)),
		fullHp: LittleMan.getFullHp(state),
		lifeCount: getLifeCount(state)
	}
}

export let buildMissionComplete = (isShowModal, nextLevelData): missionComplete => {
	return {
		isShowModal,
		nextLevelData,
	}
}