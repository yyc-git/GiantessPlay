import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../scene3d_layer/type/StateType"
import { giantessStatus, levelStatus, littleManStatus, skillStatus } from "../index/scene/store/SceneStoreType"
import * as LittleMan from "../../scene3d_layer/script/scene/scene_city/little_man/LittleMan"
import { getBiggerRemainTime, getFullBiggerTime } from "../../scene3d_layer/script/scene/scene_city/girl/InitWhenImportScene"
import { getExcitement, getFullExcitement, getFullHp, getName, getHp, getFullHpByDamagePart } from "../../scene3d_layer/script/scene/scene_city/girl/Girl"
import { damagePart, damageType } from "../../scene3d_layer/script/scene/scene_city/type/StateType"

export let getLittleManCharaterTypeGiantessBarWidth = () => 16

export let getOtherBarWidth = () => 10

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

let _computeExcitementBarStyle = (state: state, defaultWidth) => {
	return _computeBarStyle(getExcitement(state), defaultWidth, getFullExcitement(state, getName()))
}

export let buildGiantessStatus = (state: state, defaultWidth: number, damagePart: damagePart): giantessStatus => {
	let fullHp = getFullHpByDamagePart(state, damagePart)
	let hp = getHp(state, damagePart)

	return {
		target: damagePart,

		hpStyle: _computeHpBarStyle(state, defaultWidth, hp, fullHp),
		hp: Math.floor(hp),
		fullHp: fullHp,

		excitementStyle: _computeExcitementBarStyle(state, defaultWidth),
		excitement: Math.floor(getExcitement(state)),
		fullExcitement: getFullExcitement(state, getName())
	}
}


let _computeSkillBarStyle = (state: state) => {
	return _computeBarStyle(getBiggerRemainTime(state), getOtherBarWidth(), getFullBiggerTime(state), 0.97)
}

export let buildSkillStatus = (state: state): skillStatus => {
	return {
		skillStyle: _computeSkillBarStyle(state),
		value: Math.floor(getBiggerRemainTime(state)),
		fullValue: getFullBiggerTime(state),
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
	}
}