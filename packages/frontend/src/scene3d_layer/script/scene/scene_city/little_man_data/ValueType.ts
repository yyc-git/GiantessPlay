import { armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, emitterLifeFactor, speed, stressingRateFactor, armorType } from "../data/DataType"
import { emitPrecision, emitSpeed, emitterVolume, luck } from "../data/ValueType"

export type littleManValue = {
	excitement: number,

	hp: number,
	defenseFactor: defenseFactor,
	armorType: armorType,
	armorRatio: armorRatio,
	armorStrength: armorStrength,

	emitterLifeFactor: emitterLifeFactor,
	stressingRateFactor: stressingRateFactor,


	attackFactor: attackFactor,
	emitSpeedFactor: emitSpeedFactor,
	critRatioFactor: critRatioFactor,
	//missRatio: missRatio,


	moveSpeed: speed,

	restoreHpTime: number,
	restoreHpSpeedRate: number,

	luck: luck,

	// emitSpeed: emitSpeed,
	// emitterVolume: emitterVolume,
	// emitPrecision: emitPrecision
}