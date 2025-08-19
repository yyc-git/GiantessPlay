import { Map } from "immutable"
import { damageType } from "../type/StateType"
import { actionName, excitement, speed } from "./DataType"
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
	volumeFactorForGiantess: number,
	volumeFactorForNotGiantess: number,

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

	VerySlow = 600,
	Slow = 280,
	Middle = 160,
	Fast = 80,
	// VeryFast = 40
	VeryFast = 50
}

export enum emitterSpeed {
	Slow = 0.3,
	Middle = 0.5,
	Fast = 0.65,
	VeryFast = 0.9,
	MostFast = 2
}

export enum emitterLife {
	Zero = 0,
	VeryShort = 600,
	Short = 2500,
	Middle = 4000,
	Long = 7000,
	VeryLong = 14000,
}

export enum emitterSize {
	// Small_Instance = 0.02,
	// Middle_Instance = 0.05,
	// Big_Instance = 0.1,




	Small = 3,
	Middle = 4,
	Big = 6,
}

export enum emitVolume {
	Small = 0.1,
	Middle = 0.2,
	Big = 0.4,
	VeryBig = 0.8,
}

export enum emitPrecision {
	Low = 0.2,
	Middle = 0.08,
	High = 0.02,
}

export type armyValue = {
	excitement: number,
	defenseFactor: number,
	hp: number,

	moveSpeed: speed,

	// force: number,
	// damageType: damageType,

	emitSpeed: emitSpeed,
	emitVolume: emitVolume,
	emitPrecision: emitPrecision

	// emitterSpeed: emitterSpeed,
	// emitterLife: emitterLife,
	// emitterSize: emitterSize,
}

export enum weaponType {
	Light,
	Middle,
	Heavy,
	VeryHeavy
}

export type milltaryValue = {
	rotateSpeed: speed,

	emitterVolume: emitVolume,
}

export enum meleeRange {
	Near = 2.5,
	Middle = 3.5,
	Far = 5,
	VeryFar = 25
}

export type weaponValue = {
	force: number,
	type: weaponType,

	// emitSpeed: emitSpeed,
	// emitVolume: emitVolume,
	// emitPrecision: emitPrecision

	emitterSpeed: emitterSpeed,
	emitterLife: emitterLife,
	emitterSize: emitterSize,

	meleeRange: nullable<meleeRange>,
}

export type skillData = {
	name: actionName,
	excitement: excitement,
}

export type girlValue = {
	maxExcitement: number,
	scaleFactorWithExcitement: number,
	initialScale: number,

	minScaleAsSmallGiantess: number,
	minScaleAsMiddleGiantess: number,
	volumeFactorForGiantess: number,
	volumeFactorForNotGiantess: number,


	minScale: number,
	maxScale: number,

	screenShakeDistanceFactor: number,
	screenShakeTime: number,

	excitementIncreaseFactor: number,

	hp: number,
	defenseFactor: number,

	restoreHpTime: number,
	restoreHpSpeedRate: number,

	abstorbHpRate: number,

	allSkillData: Array<skillData>,

	// biggerSubExcitementTime: number,
	// biggerSubExcitementScalar: number,

	biggerMaxTime: number,
}

export enum explodeSize {
	VerySmall = 3,
	Small = 6,
	Middle = 10,
	Big = 15,
	VeryBig = 20
}