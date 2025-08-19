import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { collisionPart, particleNeedCollisionCheckLoopFrames, pose } from "../type/StateType"
import { getParticleNeedCollisionCheckLoopCount } from "../utils/ArmyUtils"
import { state } from "../../../../type/StateType"
import { mmdCharacter } from "./mmd/MMDData"

export enum axis {
	X,
	Y,
	Z
}

type size = [number, number, number]

export type directionScalar<pose> = Array<{
	pose: pose,
	value: number
}>


export type sizeData<pose> = Array<{
	pose: pose,
	value: [number, number, number]
}>

export type data<pose, collisionPart> = Array<{
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

export let getSizeFactor = (state: state) => {
	let factor
	switch (getParticleNeedCollisionCheckLoopCount(state)) {
		case particleNeedCollisionCheckLoopFrames.One:
			factor = 1
			break
		case particleNeedCollisionCheckLoopFrames.Two:
			factor = 1.1
			break
		case particleNeedCollisionCheckLoopFrames.Three:
			factor = 1.2
			break
		case particleNeedCollisionCheckLoopFrames.Four:
			factor = 1.3
			break
		default:
			throw new Error("err")
	}

	return factor
}

export let multiplyScalar = (size: size, scalar): size => {
	return [size[0] * scalar, size[1], size[2] * scalar]
}

export let getData = (state: state): data<pose, collisionPart> => {
	return [
		{
			mmds: [
				//  
				mmdCharacter.Meiko,
				//   
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				size: [
					{
						pose: pose.All,
						value: multiplyScalar([1.6 / 5, 1.6 / 6, 1.6 / 2.2], getSizeFactor(state))
					},
				],
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [mmdCharacter.Meiko,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.07
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.07
				// 	},
				// ],
				size: [
					{
						pose: pose.All,
						value: multiplyScalar([1.6 / 5, 1.6 / 6, 1.6 / 2.2], getSizeFactor(state))
					},
				]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.Nero,
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
							// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.Nero,
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
							// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Changee,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				// centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Crawl,
						value: 0
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.5], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Changee,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				// centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Crawl,
						value: 0
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.5], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.XiaHui,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.XiaHui,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 3, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Moye
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.45,
				size: [
					{
						pose: pose.All,
						value: multiplyScalar([1.6 / 5, 1.6 / 4, 1.6 / 2.2], getSizeFactor(state))
					},
				],
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [mmdCharacter.Moye,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.45,
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.07
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.07
				// 	},
				// ],
				size: [
					{
						pose: pose.All,
						value: multiplyScalar([1.6 / 5, 1.6 / 4, 1.6 / 2.2], getSizeFactor(state))
					},
				]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 4, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 4, 1.6 / 3.2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Baixi_Maid,
				mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.05
					},
					{
						pose: pose.Pick,
						value: -0.05
					},

					{
						pose: pose.Crawl,
						value: 0.02
					},
				],
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				size:
					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 4, 1.6 / 3], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Baixi_Maid,
				mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.05
					},
					{
						pose: pose.Pick,
						value: -0.05
					},

					{
						pose: pose.Crawl,
						value: 0.02
					},
				],
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1.6 / 6, 1.6 / 4, 1.6 / 3], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [

				mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
				mmdCharacter.Baixi_Maid,
				mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,
				mmdCharacter.Nero,
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Vanilla,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
				mmdCharacter.Baixi_Maid,
				mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,
				mmdCharacter.Nero,
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Vanilla,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},




		{
			mmds: [mmdCharacter.Meiko],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 0.66, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [mmdCharacter.Meiko],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 0.66, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [mmdCharacter.Meiko],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3.5, 1 / 0.9, 1 / 2.5], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [mmdCharacter.Meiko],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3.5, 1 / 0.9, 1 / 2.5], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.Baixi_Maid,
				mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,
				mmdCharacter.Nero,
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Vanilla,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				// upDirectionScalar: -0.03,
				size:

					[
						{
							pose: pose.Stand,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						},

						{
							pose: pose.Crawl,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.Baixi_Maid,
				mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,
				mmdCharacter.Nero,
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Vanilla,
				mmdCharacter.Xiaye2,
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				// upDirectionScalar: -0.03,
				size:

					[
						{
							pose: pose.Stand,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						},

						{
							pose: pose.Crawl,
							value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},



		{
			mmds: [mmdCharacter.Meiko,
			mmdCharacter.Moye,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				size: [
					{
						pose: pose.Stand,
						value: multiplyScalar([1 / 1.2, 1 / 3, 1 / 1.5], getSizeFactor(state))
					},
					{
						pose: pose.Pick,
						value: multiplyScalar([1 / 1.2, 1 / 3, 1 / 1.5], getSizeFactor(state))
					},
					{
						pose: pose.Crawl,
						value: multiplyScalar([1 / 1.8, 1 / 2.2, 1 / 2.2], getSizeFactor(state))
					},
				]
				,
				isUseGirlRotation: true,
			},
		},
		{
			mmds: [
				mmdCharacter.Baixi_Maid,
				mmdCharacter.Xiaye1,
				mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Crawl,
				// 		value: 0.03
				// 	},
				// ],
				size:

					[
						{
							pose: pose.Stand,
							value: multiplyScalar([1 / 1.4, 1 / 3, 1 / 1.7], getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: multiplyScalar([1 / 1.4, 1 / 3, 1 / 1.7], getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: multiplyScalar([1 / 1.4, 1 / 2.5, 1 / 1.7], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},

		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 1.8], getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: multiplyScalar([1 / 1.7, 1 / 1.9, 1 / 2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.XiaHui,
				mmdCharacter.Miku1,
				mmdCharacter.Nero,
				mmdCharacter.Changee,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Crawl,
				// 		value: 0
				// 	},
				// ],
				size:

					[
						{
							pose: pose.Stand,
							value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: multiplyScalar([1 / 1.7, 1 / 1.9, 1 / 2], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},



		{
			mmds: [
				mmdCharacter.Haku_Lady,
				mmdCharacter.Nero,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.075
					},
					{
						pose: pose.Pick,
						value: 0.075
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.065
					},
					{
						pose: pose.Pick,
						value: -0.065
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 3, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [

				mmdCharacter.Haku_Lady,
				mmdCharacter.Nero,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.075
					},
					{
						pose: pose.Pick,
						value: 0.075
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.065
					},
					{
						pose: pose.Pick,
						value: 0.065
					},
					{
						pose: pose.Crawl,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 3, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Meiko,
				// mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				// mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.075
					},
					{
						pose: pose.Pick,
						value: 0.075
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.065
					},
					{
						pose: pose.Pick,
						value: -0.065
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 4, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Meiko,
				// mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				// mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.075
					},
					{
						pose: pose.Pick,
						value: 0.075
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.065
					},
					{
						pose: pose.Pick,
						value: 0.065
					},
					{
						pose: pose.Crawl,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 4, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.XiaHui,
				mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.055
					},
					{
						pose: pose.Pick,
						value: 0.055
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.065
					},
					{
						pose: pose.Pick,
						value: -0.065
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 5, 1 / 4, 1 / 4.5], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				// mmdCharacter.Meiko,
				mmdCharacter.XiaHui,
				mmdCharacter.Miku1,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.055
					},
					{
						pose: pose.Pick,
						value: 0.055
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.065
					},
					{
						pose: pose.Pick,
						value: 0.065
					},
					{
						pose: pose.Crawl,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.2
					},
					{
						pose: pose.Pick,
						value: 0.2
					},
					{
						pose: pose.Crawl,
						value: -0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 5, 1 / 4, 1 / 4.5], getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 3, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 3, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.08
					},
					{
						pose: pose.Pick,
						value: 0.08
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.07
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 2.5, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.08
					},
					{
						pose: pose.Pick,
						value: 0.08
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.07
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 2.5, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 2.7, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Changee,
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 3, 1 / 2.7, 1 / 4], getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸操作",
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 3, 1 / 3], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸操作",
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 3, 1 / 3], getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [mmdCharacter.Baixi_Maid,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.075
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.075
				// 	},

				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: -0.065
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: -0.065
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.23
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.23
				// 	},
				// ],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 3, 1 / 6], getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [mmdCharacter.Baixi_Maid,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.075
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.075
				// 	},

				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.065
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.065
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.23
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.23
				// 	},
				// ],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 3, 1 / 6], getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			// mmdCharacter.Luoli1,
			mmdCharacter.Meiko,

			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.Head,
			oneBone: {
				// boneName: "メガネ",
				boneName: "頭",
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.09
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.1
					},
					{
						pose: pose.Pick,
						value: 0.08
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 1.3, 1 / 1.3, 1 / 1.3], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
			},
		},
		{
			mmds: [mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.1
					},
					{
						pose: pose.Pick,
						value: 0.1
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.13
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 2, 1 / 1, 1 / 2.7], getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Meiko,
				mmdCharacter.XiaHui,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,

			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.1
					},
					{
						pose: pose.Pick,
						value: 0.1
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
				],
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.13
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 2, 1 / 1, 1 / 2.3], getSizeFactor(state))
						},
					]
				,
			},
		},



		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,
			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftUpperArm,
			twoBones: {
				bone1Name: "左ひじ",
				bone2Name: "左腕",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,
			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightUpperArm,
			twoBones: {
				bone1Name: "右ひじ",
				bone2Name: "右腕",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},

		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.RightUpperArm,
			twoBones: {
				bone1Name: "右ひじ",
				bone2Name: "右腕",
				centerFactor: 0.5,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},


		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftLowerArm,
			twoBones: {
				bone1Name: "左手首",
				bone2Name: "左ひじ",
				centerFactor: 0.2,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightLowerArm,
			twoBones: {
				bone1Name: "右手首",
				bone2Name: "右ひじ",
				centerFactor: 0.2,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},




		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.Meiko,
			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftHand,
			twoBones: {
				bone1Name: "左中指３",
				bone2Name: "左手首",
				centerFactor: 0.4,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			mmdCharacter.Baixi_Maid,

			mmdCharacter.Meiko,
			mmdCharacter.XiaHui,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
			mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightHand,
			twoBones: {
				bone1Name: "右中指３",
				bone2Name: "右手首",
				centerFactor: 0.4,
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},


	]
}