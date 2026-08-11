import { api, gameObject, vector3, } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, speed, hp, stressingRateFactor, armorType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType";
import { luck } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType";

// export enum mmdCharacter {
// 	Baixi_Maid = "Baixi_Maid",
// }
export type mmdCharacter = string

type resourceId = string

export type mmdCharacterData = {
	heightScale: number
}


export type mmdData = [
	mmdCharacter, resourceId, any,
	mmdCharacterData
]

type materialName = string

export type mmdMaterialFixData = Array<{
	mmdCharacter: mmdCharacter,
	noBlendingMaterialNamesInVivo: Array<materialName>,
	diffuseFactor?: number
}>



export type clothName = string

type body = "身体" | "Body"

// export type damagePart = "身体" | clothName
export type damagePart = body | clothName


export type singleClothCollisionData<collisionPart> = {
	collisionPart: Array<collisionPart>,
	damagePart: damagePart,
	damageParts?: Array<damagePart>,
	children: Array<singleClothCollisionData<collisionPart>>

}

export type clothCollisionData<collisionPart> = Array<{
	mmdCharacter: mmdCharacter,
	data: Array<singleClothCollisionData<collisionPart>>
}>


// export enum hp {
// 	VeryLow = 100,
// 	Low = 200,
// 	Middle = 400,
// 	High = 800,
// 	VeryHigh = 1600
// }

// export enum speed {
// 	Zero = 0,
// 	VeryLow = 1,
// 	Low = 2,
// 	Middle = 3,
// 	High = 5,
// 	VeryHigh = 10
// }


// export enum armorRatio {
// 	None = 0,
// 	Light = 0.3,
// 	Middle = 0.5,
// 	Heavy = 0.7,
// 	VeryHeavy = 0.9
// }

// export enum armorStrength {
// 	Zero = 0,
// 	VeryLow = 5,
// 	Low = 10,
// 	Middle = 20,
// 	High = 40,
// 	VeryHigh = 60
// }


export type clothHpData = Array<{
	mmdCharacter: mmdCharacter,
	data: Array<{
		damagePart: damagePart,
		hp: hp,
		// defenseFactor: number,
		armorType: armorType,
		armorRatio: armorRatio,
		armorStrength: armorStrength,
		stressingFactorWhenDestroyed?: number,
	}>
}>

// export enum defenseFactor {
//     VeryHigh = 2,
//     High = 1.5,
//     Middle = 1,
//     Low = 0.5,
//     VeryLow = 0.3,
//     VeryLow2 = 0.1,
// }

export enum stressingFactorWhenDestroyed {
	VeryHigh = 4,
	High = 3,
	Middle = 2.5,
	Low = 2,
	VeryLow = 1.5,
	VeryLow2 = 1,
}

export type firstPersonControlsData = Array<{
	mmdCharacter: mmdCharacter,
	data: {
		// getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => Vector3,
		getCameraPositionForFirstPersonControlsFunc: (api: api, girl: gameObject) => vector3,

		hideMaterialNames: Array<string>,
	}
}>


type skeletonName = string

export enum shoeType {
	None,
	Heel,
	RearHeel,
	Common
}

export type shoeData = Array<{
	mmdCharacter: mmdCharacter,
	data: {
		shoeType: shoeType,
		notIKBones?: Array<{
			name: skeletonName,
			yOffset: number
		}>,
		ikBones?: Array<{
			names: Array<skeletonName>,
			yOffset: number
		}>,
		// hideMaterialNames: Array<string>,
	}
}>

export type boneNameForLightStressing = Array<{
	mmdCharacter: mmdCharacter,
	boneName: Record<any, string>,
	boneAmplitude?: Record<any, number>,
}>

export type dataForPartialScale = Array<{
	mmdCharacter: mmdCharacter,
	scaleXYForBreast: number,
	scaleZForBreast: number,
}>

export type pickControlledTransformData = Array<{
	mmdCharacter: mmdCharacter,
	positionOffset: [number, number, number],
}>


export type shoeControlledTransformData = Array<{
	mmdCharacter: mmdCharacter,
	positionOffset: [number, number, number],
	isToToe?:boolean,
}>


export type attributeData = Array<{
	mmdCharacter: mmdCharacter,

	initialScale: number,
	scaleIncrease: number,
	maxScale: number,
	minScale: number,

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

	biggerMaxTime: number,

	luck?: luck,
	armorRatio: armorRatio,
	armorStrength: armorStrength,
	stressingRateFactor: stressingRateFactor,
}>

export enum collisionPart {
	BoundingBox = "BoundingBox",

	LeftFoot = "LeftFoot",
	RightFoot = "RightFoot",
	LeftShank = "LeftShank",
	RightShank = "RightShank",
	LeftThigh = "LeftThigh",
	RightThigh = "RightThigh",
	TrigoneAndButt = "TrigoneAndButt",
	LeftBreast = "LeftBreast",
	RightBreast = "RightBreast",
	// Body = "Body",
	LeftUpperArm = "LeftUpperArm",
	RightUpperArm = "RightUpperArm",
	LeftLowerArm = "LeftLowerArm",
	RightLowerArm = "RightLowerArm",
	Head = "Head",

	Torso = "Torso",

	LeftHand = "LeftHand",
	RightHand = "RightHand",
}

export enum resourceLevel {
	White = "White",
	Green = "Green",
	Blue = "Blue",
	Purple = "Purple",
}

type name = string

export type selectCharacterData = [
	string,
	mmdCharacter,
	name,

	boolean,

	resourceLevel
]




export enum axis {
	X,
	Y,
	Z
}

// type size = [number, number, number]

export type directionScalar<pose> = Array<{
	pose: pose,
	value: number
}>


export type sizeData<pose> = Array<{
	pose: pose,
	value: [number, number, number]
}>

export type data<mmdCharacter, pose, collisionPart> = Array<{
	mmds: Array<mmdCharacter>,
	collisionPart: collisionPart,
	twoBones?: {
		bone1Name: string,
		bone2Name: string,

		centerFactor?: number,
		// frontDirectionScalar?: number,
		// rightDirectionScalar?: number,
		// upDirectionScalar?: number,
		frontDirectionScalar?: directionScalar<pose>,
		rightDirectionScalar?: directionScalar<pose>,
		upDirectionScalar?: directionScalar<pose>,

		size: sizeData<pose>,

		isUseGirlRotation: boolean,
		// rotationOffset?: number,
		// rotationAxis?: axis
		rotation?: [number, number, number]
	},
	oneBone?: {
		boneName: string,

		frontDirectionScalar?: directionScalar<pose>,
		rightDirectionScalar?: directionScalar<pose>,
		upDirectionScalar?: directionScalar<pose>,

		size: sizeData<pose>,

		// isUseGirlRotation: boolean,
		// rotationOffset: nullable<number>,
		// rotationAxis: nullable<axis>

		isUseGirlRotation?: boolean,
		rotation?: [number, number, number]
	}
}>

export enum pose {
	All = "All",

	Stand = "Stand",
	Crawl = "Crawl",
	Pick = "Pick",
	Sit = "Sit",
}

export enum initialScale {
	// VeryLow = 3,
	VeryLow = 4,
	Low = 6,
	Middle = 8,
	High = 12,
	VeryHigh = 16,
}


export enum excitementIncreaseFactor {
	VeryLow = 0.25,
	Low = 0.5,
	Middle2 = 0.6,
	Middle1 = 0.8,
	Middle = 1,
	High2 = 1.3,
	High1 = 1.5,
	High = 2,
	VeryHigh = 4,
}

export type service = {
	handleVMDPath: (mmdCharacter: mmdCharacter, [getNewPathFunc1, getNewPathFunc2]: any, originPath: string) => string,

	getMMDData: (state: state, getVMDDataFunc: any, name: string) => Array<mmdData>,
	getMMDMaterialFixData: (api: api) => mmdMaterialFixData,
	getClothCollisionData: (shoeDamagePart: string) => clothCollisionData<collisionPart>,
	getClothHpData: (fullHp: hp, body: string, shoeDamagePart: string) => clothHpData,
	getFirstPersonControlsData: () => firstPersonControlsData,
	getShoeData: () => shoeData,
	getBoneNameForLightStressing: () => boneNameForLightStressing,
	getDataForPartialScale: () => dataForPartialScale,
	getPickedTransform: () => pickControlledTransformData,
	getUBControlledTransform: () => pickControlledTransformData,
	getPutToBreastTransform: () => pickControlledTransformData,
	getPutToShoeTransform: () => pickControlledTransformData,
	getSelectCharacterData: (api: api, state: state) => Array<selectCharacterData>,
	getSnapshotData: (name: string) => Array<[mmdCharacter, string]>,
	// getMMDData: (state: state, getVMDDataFunc: any, name: string) => Array<mmdData>,
	// getMMDMaterialFixData: (api: api) => mmdMaterialFixData,
	// getClothHpData: (fullHp: hp, body: string) => Array<clothHpData>,
	// getFirstPersonControlsData: () => Array<firstPersonControlsData>,
	// getShoeData: () => Array<shoeData>,
	// getBoneNameForLightStressing: () => Array<boneNameForLightStressing>,
	// getSelectCharacterData: (name: string) => Array<selectCharacterData>,
	// getSnapshotData: (name: string) => Array<string>,


	getCollisionShapeData: (api: api, state: state) => data<mmdCharacter, pose, collisionPart>,

	getAttributeData: () => attributeData,

	// isEnablePhysics: (mmdCharacter: mmdCharacter) => boolean,
}