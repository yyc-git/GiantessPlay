import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../type/StateType"
import { collisionPart, force, phase } from "../type/StateType"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer"
import type { Box3, Matrix4, Vector3 } from "three"


export enum animatioNameAndActionName {
	// Idle = "Idle",
	// Walk = "Walk",
	Stomp = "Stomp",
	Run = "Run",

	HeavyStressing = "HeavyStressing",
	HeavyStressingBreast = "HeavyStressingBreast",
	HeavyStressingTrigoneAndButt = "HeavyStressingTrigoneAndButt",
	Death = "Death",

	StandToCrawl = "StandToCrawl",
	CrawlToStand = "CrawlToStand",

	// KeepCrawl = "KeepCrawl",
	BreastPress = "BreastPress",
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



	// Hello = "Hello"
}

enum extendedAnimationName {
	Idle = "Idle",
	Walk = "Walk",

	KeepCrawl = "KeepCrawl",
	CrawlMove = "CrawlMove",

	KeepPick = "KeepPick",



	Hello = "Hello"
}

export type animationName = animatioNameAndActionName | extendedAnimationName
export const animationName = { ...animatioNameAndActionName, ...extendedAnimationName }


enum extendedActionName {
	Bigger = "Bigger",
	Smaller = "Smaller",
}

export type actionName = animatioNameAndActionName | extendedActionName
export const actionName = { ...animatioNameAndActionName, ...extendedActionName }





export type animationBlendData<animationName> = Array<{
	condition: (state: state) => boolean,
	// isCurrentAnimationName?: (state: state) => boolean,

	// currentAnimationName?: animationName,
	currentAnimationNames: Array<animationName>,
	nextAnimationName: animationName,
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
	Event
}

export enum effect {
	ScreenShake
}

export enum particle {
	StompDust,
	WaterBloom
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
	MostHigh = 10
}

export enum defenseFactor {
	VeryLow = 0.5,
	Low = 1,
	Middle = 3,
	High = 10,
	VeryHigh = 30
}

export enum hp {
	VeryLow = 150,
	Low = 300,
	Middle = 500,
	High = 1000,
	VeryHigh = 3000
}

export enum speed {
	Zero = 0,
	VeryLow = 1,
	Low = 2,
	Middle = 3,
	High = 5,
	VeryHigh = 10
}

export enum forceSize {
	None = 0,
	VeryLow = 90,
	Low = 190,
	Middle = 300,
	High = 600,
	VeryHigh = 1000,
}

export enum lieKeepTime {
	Short = 1500,
	Middle = 2000,
	Long = 2500,
}
