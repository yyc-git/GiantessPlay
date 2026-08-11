import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../type/StateType"
import { collisionPart, force, phase, usedGirl } from "../type/StateType"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer"
import type { Box3, Matrix4, Vector3 } from "three"


export enum animatioNameAndActionName {
	None = "None",

	// Idle = "Idle",
	// Walk = "Walk",
	// Stomp = "Stomp",
	Run = "Run",

	HeavyStressing = "HeavyStressing",
	HeavyStressingBreast = "HeavyStressingBreast",
	HeavyStressingTrigoneAndButt = "HeavyStressingTrigoneAndButt",
	Death = "Death",

	StandToCrawl = "StandToCrawl",
	CrawlToStand = "CrawlToStand",

	// KeepCrawl = "KeepCrawl",
	// BreastPress = "BreastPress",
	// CrawlMove = "CrawlMove",


	CrawlHeavyStressing = "CrawlHeavyStressing",
	CrawlHeavyStressingBreast = "CrawlHeavyStressingBreast",
	CrawlHeavyStressingTrigoneAndButt = "CrawlHeavyStressingTrigoneAndButt",
	CrawlDeath = "CrawlDeath",




	Pickup = "Pickup",
	Pickdown = "Pickdown",
	// KeepPick = "KeepPick",
	Pinch = "Pinch",
	Eat = "Eat",
	// PickToUB = "PickToUB",
	// UBToPick = "UBToPick",
	// Thrust = "Thrust",
	// Insert = "Insert",



	// Hello = "Hello"
}

enum extendedAnimationName {
	Idle = "Idle",
	Walk = "Walk",

	KeepCrawl = "KeepCrawl",
	CrawlMove = "CrawlMove",

	KeepPick = "KeepPick",

	// Hello = "Hello"
}

export type animationName = animatioNameAndActionName | extendedAnimationName | string
export const animationName = { ...animatioNameAndActionName, ...extendedAnimationName }


enum extendedActionName {
	Bigger = "Bigger",
	// Smallest = "Smallest",
	SmallerToLastBiggerCount = "SmallerToLastBiggerCount",

	Reborn = "Reborn",


	FallByQTE = "FallByQTE",
	Fall = "Fall",
}

export type actionName = animatioNameAndActionName | extendedActionName | string
export const actionName = { ...animatioNameAndActionName, ...extendedActionName }





export type animationBlendData<animationName> = Array<{
	condition: (state: state, usedGirl: usedGirl) => boolean,
	// isCurrentAnimationName?: (state: state) => boolean,

	// currentAnimationName?: animationName,
	currentAnimationNames: Array<animationName | string>,
	nextAnimationName: animationName | string,
	weight?: number,
	noBlend?: boolean,
	isOnlyPlayOnce?: boolean,
}>

export enum track {
	Audio,
	Effect,
	Particle,
	// ShapeDamage,
	RangeDamage,
	RangeRepel,
	Event
}

export enum effect {
	ScreenShake
}

export enum particle {
	StompDust,
	WaterBloom,
	Milk
}

type collisionData =
	//  [
	// 	collisionPart,
	// 	Array<[nullable<InstanceSourceLOD>, nullable<[StaticLODContainer, [Array<Matrix4>, Array<Box3>, Array<string>]]>]>,
	// 	// phase,
	// 	// Vector3
	// ]
	Record<collisionPart, Array<[nullable<InstanceSourceLOD>, nullable<[StaticLODContainer, [Array<Matrix4>, Array<Box3>, Array<string>]]>]>>



// type animationCollisionValue = any

export type frameIndex = number

// type frameCount = number

export type computeDirectionFunc = (state: state, box: Box3) => Vector3

export type animationCollisionData<animationName> = {
	name: animationName,
	shapeDamage: Array<collisionPart>,
	timeline: Array<{
		frameIndex?: number,
		// toFrameIndex?: number,
		frameIndices?: Array<number>,
		frameRange?: number,
		track: track,
		value: <T> (state: state,
			usedGirl: usedGirl,
			{
				frameIndex,
				animationName,
				phase,
				force
			}: {
				frameIndex: frameIndex,
				animationName: animationName,
				phase: phase,
				force: force
			}
		) => T
		// value: (state: state,
		// 	{
		// 		frameIndex,
		// 		animationName,
		// 		phase,
		// 		force
		// 	}: {
		// 		frameIndex: frameIndex,
		// 		animationName: animationName,
		// 		phase: phase,
		// 		force: force
		// 	}
		// ) => any
	}>
}

export type actionData<animationName> = Array<{
	name: animationName,
	force: Record<phase, number>,
}>

export type phaseData<animationName> = Array<{
	name: animationName,
	value: Array<{
		frameIndexRange: [number, number],
		phase: phase
	}>
}>

export type skillStressingFactor = Array<{
	name: animationName,
	value: number
}>

export enum articluatedAnimationName {
	Scale = "Scale",

	Light_Stressing_Giantess_Move = "Light_Stressing_Giantess_Move",
	Light_Stressing_Giantess_Rotate = "Light_Stressing_Giantess_Rotate",

	Light_Stressing_Army_Move = "Light_Stressing_Army_Move",


	Stressing_Rotate1 = "Stressing_Rotate1",
	Stressing_Move1 = "Stressing_Move1",

	Destroyed_Rotate1 = "Destroyed_Rotate1",
	Destroyed_Move1 = "Destroyed_Move1",


	Tank_Fire = "Tank_Fire",
}

type object_ = any

type time = number

export type articluatedAnimationData<articluatedAnimationName> = {
	name: articluatedAnimationName,
	// initial: object_,
	initial: (state: state, getValueFunc) => object_,
	tweens: (state: state, getParamFunc) => Array<[object_, time]>,
	repeatCount: number
}

export enum excitement {
	Zero = 0,
	VeryLow = 0.1,
	Low = 0.5,
	Middle = 1,
	High = 3,
	VeryHigh = 5,
	VeryHigh1 = 6,
	VeryHigh2 = 7,
	VeryHigh3 = 8,
	VeryHigh4 = 9,
	MostHigh = 10,
	// MostHigh2 = 15
}


export enum skillExcitement {
	Zero = 0,
	VeryLow = 1.25,
	Low = 2.5,
	Middle = 5,
	Middle1 = 6,
	Middle2 = 7,
	Middle3 = 8,
	Middle4 = 9,
	High = 10,
	High1 = 12,
	High2 = 14,
	High3 = 16,
	High4 = 18,
	VeryHigh = 20,
	VeryHigh1 = 25,
	VeryHigh2 = 30,
	MostHigh = 40,
	MostHigh1 = 50,
}

export enum experienceFactor {
	VeryLow = 0.1,
	Low = 0.5,
	Middle = 1,
	Middle1 = 1.15,
	Middle2 = 1.3,
	Middle3 = 1.6,
	// High = 1.5,
	High = 2,
	High1 = 2.2,
	High2 = 2.4,
	// VeryHigh = 2,
	VeryHigh = 3,
	// VeryHigh2 = 3,
}


export enum defenseFactor {
	// VeryLow = 0.5,
	// Low = 1,
	// Middle = 3,
	// High = 10,
	// VeryHigh = 30

	// VeryLow2 = 0.1,
	// VeryLow = 0.2,
	// Low = 0.5,
	// Middle = 1,
	// High = 3,
	// VeryHigh = 10

	VeryLow4 = 0.01,
	VeryLow3 = 0.025,
	VeryLow2 = 0.05,
	// VeryLow = 0.06,
	VeryLow = 0.08,
	Low = 0.1,
	Middle = 0.16,
	High = 0.3,
	VeryHigh = 0.45
}

export enum attackFactor {
	// Zero=0,
	// VeryLow = 0.2,
	// Low = 0.5,
	// Middle = 1,
	// High = 2,
	// VeryHigh = 3

	Zero = 0,
	VeryLow3 = 0.25,
	VeryLow2 = 0.5,
	VeryLow = 1,
	Low4 = 1.1,
	Low3 = 1.2,
	Low2 = 1.3,
	Low1 = 1.4,
	Low = 1.5,
	Middle = 2,
	High = 2.5,
	VeryHigh = 3
}

export enum hp {
	VeryLow = 100,
	Low = 200,
	Middle1 = 300,
	Middle = 400,
	High3 = 500,
	High2 = 600,
	High1 = 700,
	High = 800,
	// High2 = 1200,
	VeryHigh2 = 1200,
	VeryHigh = 1600
}

export enum restoreHpTime {
	VeryLow = 3500,
	Low = 4000,
	Middle = 4500,
	High = 5500,
	VeryHigh = 6500,
}

export enum restoreHpSpeedRate {
	VeryLow = 0.25 / 100,
	Low = 0.5 / 100,
	Middle = 1 / 100,
	High = 2 / 100,
	VeryHigh = 3 / 100,
}

export enum biggerMaxTime {
	VeryLow = 10000,
	Low = 20000,
	Middle = 30000,
	High = 40000,
	VeryHigh = 50000,
	// VeryLow = 1000,
	// Low = 2000,
	// Middle = 3000,
	// High = 4000,
	// VeryHigh = 5000,
}

export enum abstorbHpRate {
	// VeryLow = 5 / 100,
	// Low = 10 / 100,
	// Middle = 15 / 100,
	// High = 20 / 100,
	// VeryHigh = 25 / 100,

	VeryLow = 1 / 100,
	Low = 2 / 100,
	Middle = 3 / 100,
	High = 4 / 100,
	VeryHigh = 5 / 100,
}


export enum speed {
	Zero = 0,
	VeryLow = 1,
	Low = 2,
	Middle = 3,
	High = 5,
	High2 = 7.5,
	VeryHigh = 10
}

export enum armorType {
	Giantess,
	Mech,
	LittleMan,
	Building,
	Light,
	Heavy,
}

export enum armorRatio {
	None = 0,
	Light5 = 0.02,
	Light4 = 0.04,
	Light3 = 0.08,
	Light2 = 0.15,
	Light = 0.3,
	Middle1 = 0.4,
	Middle = 0.5,
	Heavy1 = 0.6,
	Heavy = 0.7,
	VeryHeavy = 0.9,
	MostHigh = 1,
}

export enum armorStrength {
	Zero = 0,
	VeryLow5 = 0.1,
	VeryLow4 = 0.5,
	VeryLow3 = 1,
	VeryLow2 = 1.5,
	VeryLow1 = 3,
	VeryLow = 5,
	Low = 10,
	Middle = 20,
	High = 40,
	VeryHigh = 60
}

export enum emitSpeedFactor {
	VeryLow2 = 2.6,
	VeryLow = 2.2,
	Low = 1.5,
	Middle = 1,
	High = 0.6,
	VeryHigh = 0.4
}

export enum emitterLifeFactor {
	VeryLow = 0.4,
	Low = 0.6,
	Middle = 1,
	High = 1.5,
	VeryHigh = 2
}

export enum stressingRateFactor {
	// VeryLow = 2.2,
	// Low = 1.5,
	// Middle = 1,
	// High = 0.6,
	// VeryHigh = 0.4

	VeryHigh = 2.2,
	High2 = 1.9,
	High1 = 1.7,
	High = 1.5,
	Middle2 = 1.2,
	Middle = 1,
	Low = 0.6,
	VeryLow = 0.4,
	// Lowest = 0.01,
	// Zero = 0,
}


export enum critRatioFactor {
	Zero = 0,
	VeryLow = 0.2,
	Low = 0.5,
	Middle = 1,
	High = 2,
	VeryHigh = 3
}

// export enum missRatio {
// 	// Zero = 0,
// 	// VeryLow = 0.01,
// 	// Low = 0.02,
// 	// Middle = 0.05,
// 	// Big = 0.1,
// 	// VeryBig = 0.2,

// 	// TODO need restore
// 	Zero = 0,
// 	VeryLow = 0,
// 	Low = 0,
// 	Middle = 0,
// 	Big = 0,
// 	VeryBig = 0,
// }

export enum forceSize {
	RewardForce = -1,
	None = 0,
	// VeryLow = 90,
	// Low = 190,
	// Middle = 300,
	// High = 600,
	// VeryHigh = 1000,

	// VeryLow6 = 1,
	// VeryLow5 = 3,
	// VeryLow4 = 5,
	// VeryLow3 = 10,
	// VeryLow2 = 20,
	VeryLow6 = 1,
	VeryLow5 = 2,
	VeryLow4 = 3,
	VeryLow3 = 7,
	VeryLow2 = 15,

	// VeryLow = 40,
	// Low2 = 60,
	// Low = 80,
	VeryLow = 30,
	Low2 = 45,
	Low = 60,
	// Middle = 150,
	// Middle2 = 200,
	// High = 250,
	// High2 = 350,
	// VeryHigh = 500,
	// VeryHigh2 = 1000,
	Middle = 100,
	Middle2 = 130,
	High = 170,
	High2 = 220,
	VeryHigh = 300,
	VeryHigh2 = 500,
	// High = 200,
	// VeryHigh = 400,
}

export enum lieKeepTime {
	Short = 1500,
	Middle = 2000,
	Long = 2500,

	// Short = 700,
	// Middle = 1000,
	// Long = 1500,
}


export enum giantessForceSize {
	Negative = -100,
	Zero = 0,
	VeryLow = 2,
	VeryLow1 = 3,
	VeryLow2 = 4,
	Low = 5,
	Low1 = 6,
	Low2 = 7,
	Low3 = 8,
	Low4 = 9,
	Middle = 10,
	Middle1 = 12,
	Middle2 = 15,
	Middle3 = 16,
	Middle4 = 18,
	High = 20,
	High1 = 25,
	High2 = 30,
	VeryHigh = 40,
	VeryHigh1 = 50,
	VeryHigh2 = 60,
	VeryHigh3 = 70,
}

export enum skillStressingValue {
	Zero = 0,
	VeryLow = 0.25,
	Low = 0.5,
	Middle = 1,
	Middle1 = 1.1,
	Middle2 = 1.2,
	Middle3 = 1.3,
	Middle4 = 1.4,
	High = 1.5,
	VeryHigh = 2,
	VeryHigh1 = 2.5,
	VeryHigh2 = 3,
}