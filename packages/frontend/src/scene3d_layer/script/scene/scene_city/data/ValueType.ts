import { Map } from "immutable"
import { damageType } from "../type/StateType"
import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, forceSize, speed, armorType, experienceFactor, animationName, stressingRateFactor, skillExcitement } from "./DataType"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

export type objectValue = {
	excitement: number,
	defenseFactor: number,
	hp: number
}

export type characterValue = {
	maxExcitement: number,
	scaleFactorWithExcitement: number,
	initialScale: number,
	minScaleAsSmallGiantess: number,
	minScaleAsMiddleGiantess: number,
	volumeFactorForMiddleOrBigGiantess: number,
	volumeFactorForSmallGiantess: number,

	screenShakeDistanceFactor: number,
	screenShakeTime: number,

	excitementIncreaseFactor: number,
}

export enum emitSpeed {
	// VerySlow2 = 700,

	// VerySlow = 300,
	// Slow = 140,
	// Middle = 70,
	// Fast = 30,
	// VeryFast = 20

	// VerySlow = 600,
	// VerySlow = 560,
	VerySlow = 560,
	// Slow = 280,
	Slow = 300,
	Middle2 = 240,
	Middle1 = 200,
	Middle = 160,
	Fast = 80,
	VeryFast = 40,
	VeryFast2 = 20
}


export enum emitterSpeed {
	Slow = 0.3,
	Middle = 0.5,
	Fast = 0.65,
	VeryFast = 0.9,
	MostFast1 = 1.5,
	MostFast = 2,
	MaxFast = 5,
}

export enum emitterLife {
	Zero = 0,
	// VeryShort = 600,
	// Short = 2500,
	// Middle = 4000,
	// Long = 7000,
	// VeryLong = 14000,

	// VeryShort = 300,
	// Short = 1200,
	// Middle = 2000,
	// Long = 3500,
	// VeryLong = 7000,

	VeryShort = 400,
	Short = 1600,
	Middle = 2800,
	Long = 4200,
	VeryLong = 8400,
	VeryLong2 = 15000,
	MaxLong = 30000,
}

export enum emitterSize {
	Small = 3,
	Middle = 4,
	Big = 6,
	VeryBig = 10,
}

export enum emitterCollisionSize {
	Small = 3,
	Middle = 4,
	Big = 6,
	VeryBig = 12,
	VeryBig1 = 17,
	VeryBig2 = 22,
	VeryBig3 = 28,
}

export enum emitterVolume {
	// Small = 0.1,
	// Middle = 0.2,
	// Middle2 = 0.3,
	// Big = 0.4,
	// VeryBig = 0.8,
	Small = 0.05,
	Middle = 0.1,
	Middle2 = 0.15,
	Big = 0.2,
	VeryBig = 0.4,
}

export enum emitPrecision {
	Low = 0.2,
	Middle = 0.08,
	High = 0.02,
}

export enum scale {
	Low = 3,
	Middle = 6,
	High = 9,
	VeryHigh = 12,
}


// export enum defenseSkill {
// 	VeryLow = 0.2,
// 	Low = 0.5,
// 	Middle = 1,
// 	High = 1.5,
// 	VeryHigh = 3
// }

export type armyValue = {
	excitement: number,

	defenseFactor: defenseFactor,
	// defenseSkill: defenseSkill,
	armorType: armorType,
	armorRatio: armorRatio,
	armorStrength: armorStrength,
	attackFactor: attackFactor,
	moveSpeed: speed,
	emitSpeedFactor: emitSpeedFactor,
	critRatioFactor: critRatioFactor,
	//missRatio: missRatio,

	hp: number,


	// force: number,
	// damageType: damageType,

	// emitSpeed: emitSpeed,
	emitPrecision: emitPrecision

	// emitterSpeed: emitterSpeed,
	// emitterLife: emitterLife,
	// emitterSize: emitterSize,
}

export type eliteGiantessValue = {
	scale: number,
}

export enum weaponType {
	// None,
	// Light,
	// Middle,
	// Heavy,
	// VeryHeavy

	Explode,
	Impact,
	Magic,
	Body,
	Power,
	Common,

	Effect,
	EffectSelf,
}

export type milltaryValue = {
	rotateSpeed: speed,

	// emitterVolume: emitterVolume,
}

export enum meleeRange {
	/*! avoid too near that bullet can't hit(because >= particleNeedCollisionCheckLoopFrames.Two)
	 
	Near = 2.5,
	Middle = 3.5,
	*/
	// Girl = -1,
	Zero = 0,
	VeryNear = 2.5,
	// VeryNear2 = 3.5,
	Near = 5,
	Middle = 7,
	Far = 10,
	VeryFar = 25
}


// export enum weaponDamageType {
// 	Light,
// 	Middle,
// 	Heavy,
// }


export enum critRatio {
	Zero = 0,
	VeryLow = 0.01,
	Low = 0.02,
	Middle = 0.05,
	Big = 0.1,
	VeryBig = 0.2,
}

export enum explodeRange {
	Zero = 0,
	VeryLow = 1,
	Low = 2,
	Middle = 3,
	Big = 4,
	VeryBig = 5
}

export enum armorPiercingForceRatio {
	// None = 0,
	// VeryLow = 40,
	// Low = 80,
	// Middle = 150,
	// High = 250,
	// VeryHigh = 500,

	None = 0,
	VeryLow2 = 0.025,
	VeryLow = 0.05,
	Low = 0.1,
	Middle = 0.2,
	High = 0.3,
	VeryHigh = 0.4,
	VeryHigh2 = 0.5,
}

export enum weaponName {
	LaserGun,
	RocketGun,
	Swiping,

	Other,
}

export enum emitterCount {
	Zero = 0,
	One = 1,
	Less = 3,
	// More = 10,
	More = 8,
	VeryMore = 15,
	// Most = 50,
	Most = 20,
}

export type weaponValue = {
	force: forceSize,
	armorPiercingForceRatio: armorPiercingForceRatio,


	type: weaponType,

	emitSpeed: emitSpeed,
	critRatio: critRatio,
	explodeRange: explodeRange,

	emitterSpeed: emitterSpeed,
	emitterLife: emitterLife,
	emitterSize: emitterSize,
	emitterCollisionSize: emitterCollisionSize,
	emitterVolume: emitterVolume,
	emitterCount: emitterCount,

	meleeRange: nullable<meleeRange>,


	customData?: any,
}

export type skillData = {
	name: actionName,
	excitement: skillExcitement,
}

export type animationData = {
	// name: animationName,
	experienceFactor: experienceFactor,
}

export enum luck {
	VeryLow = 0.2,
	Low = 0.5,
	Middle = 1,
	High = 2,
	VeryHigh = 4,
}

export type girlValue = {
	maxExcitement: number,
	scaleFactorWithExcitement: number,
	initialScale: number,

	// minScaleAsSmallGiantess: number,
	// minScaleAsMiddleGiantess: number,
	// minScaleAsBigGiantess: number,
	volumeFactorForMiddleOrBigGiantess: number,
	volumeFactorForSmallGiantess: number,


	scaleIncrease: number,
	maxScale: number,
	minScale: number,

	screenShakeDistanceFactor: number,
	screenShakeTime: number,

	excitementIncreaseFactor: number,

	hp: number,

	defenseFactor: defenseFactor,
	// armorRatio: armorRatio,
	// armorStrength: armorStrength,
	attackFactor: attackFactor,
	// emitSpeedFactor: emitSpeedFactor,
	critRatioFactor: critRatioFactor,
	//missRatio: missRatio,


	restoreHpTime: number,
	restoreHpSpeedRate: number,

	abstorbHpRate: number,

	allSkillData: Array<skillData>,

	// biggerSubExcitementTime: number,
	// biggerSubExcitementScalar: number,

	biggerMaxTime: number,

	luck?: luck,
	armorRatio: armorRatio,
	armorStrength: armorStrength,
	stressingRateFactor: stressingRateFactor,
}

export enum explodeSize {
	VerySmall = 3,
	Small = 6,
	Middle = 10,
	Big = 15,
	VeryBig = 20
}