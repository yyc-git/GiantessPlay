import { pose as poseEnum } from "../../../type/StateType"
import { state } from "../../../../../../type/StateType"
import { data, getSizeFactor, multiplyScalar } from "../../CollisionShapeData"
import { mmdCharacter } from "../../mmd/MMDData"


export enum collisionPart {
	LeftFoot1 = "LeftFoot1",
	LeftFoot2 = "LeftFoot2",
	RightFoot1 = "RightFoot1",
	RightFoot2 = "RightFoot2",
	LeftShank1 = "LeftShank1",
	LeftShank2 = "LeftShank2",
	RightShank1 = "RightShank1",
	RightShank2 = "RightShank2",
	LeftThigh = "LeftThigh",
	RightThigh = "RightThigh",
	TrigoneAndButt = "TrigoneAndButt",
	LeftBreast = "LeftBreast",
	RightBreast = "RightBreast",
	LeftNipple = "LeftNipple",
	RightNipple = "RightNipple",
	LeftUpperArm = "LeftUpperArm",
	RightUpperArm = "RightUpperArm",
	LeftLowerArm = "LeftLowerArm",
	RightLowerArm = "RightLowerArm",
	Head = "Head",

	LowBreast = "LowBreast",
	Torso = "Torso",

	LeftHand = "LeftHand",
	RightHand = "RightHand",

	RightFinger = "RightFinger",
	LeftFinger = "LeftFinger",

}


// export enum pose {
// 	All,

// 	// TODO remove
// 	Stand,
// 	Crawl,
// 	Pick,

// 	All
// }

enum extendedPose {
	Lie = "Lie",

	HeavyStressingLie = "HeavyStressingLie",
}

export type pose = poseEnum | extendedPose
export const pose = { ...poseEnum, ...extendedPose }


export let getData = (state: state): data<pose, collisionPart> => {
	return [
		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightFoot1,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.05
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: 0.045,
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0.05
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
						// 	// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0.18, 0.12, 0.23], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.2, 0.3, 0.4]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftFoot1,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.0
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						// value: -0.035
						value: 0
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
						// 	// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							// value: multiplyScalar([0.55, 0.4, 0.42], getSizeFactor(state))
							value: multiplyScalar([0.57, 0.37, 0.29], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				isUseGirlRotation: true,
				// rotation: [-0.2, 0.3, 0.4]
				rotation: [0, 0, 0]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightFoot2,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.03
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.045
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
						// 	// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0.23, 0.6, 0.3], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.3, -0.07, 0.4]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftFoot2,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				// frontDirectionScalar: -0.05,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.05
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.055
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], getSizeFactor(state))
						// 	// value: multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0, 0, 0], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.4, 0.3, 0.4]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightShank1,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.15
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.02
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1 / 4, 1 / 0.7, 1 / 4], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0.24, 0.4, 0.21], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.16, 0.07, 0],
				isUseGirlRotation: true,
				rotation: [1.57, 0, 0],
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftShank1,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.05
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1 / 4, 1 / 0.7, 1 / 4], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0.24, 0.22, 1.4], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.16, 0.07, 0],
				isUseGirlRotation: true,
				rotation: [0.1, 0.3, 0],
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightShank2,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.09
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1 / 4, 1 / 0.7, 1 / 4], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0.3, 0.87, 0.35], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.16, 0.07, 0],
				isUseGirlRotation: true,
				rotation: [1.8, 0, 0.1],
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftShank2,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.09
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
				],
				size:

					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([1 / 4, 1 / 0.7, 1 / 4], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0, 0, 0], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.16, 0.07, 0],
				isUseGirlRotation: true,
				rotation: [1.8, 0, 0.1],
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				// upDirectionScalar: -0.03,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.05
					},
				],
				size:

					[
						// {
						// 	pose: pose.Stand,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						// },
						// {
						// 	pose: pose.Pick,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						// },

						// {
						// 	pose: pose.Crawl,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], getSizeFactor(state))
						// },


						{
							pose: pose.All,
							value: multiplyScalar([0.35, 1.16, 0.415], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.13, 0.07, 0]
				isUseGirlRotation: true,
				// rotation: [1.64, 0, 0.12]
				rotation: [1.64, 0, 0.05]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				// upDirectionScalar: -0.03,
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.06
					},
				],
				size:

					[
						// {
						// 	pose: pose.Stand,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						// },
						// {
						// 	pose: pose.Pick,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], getSizeFactor(state))
						// },

						// {
						// 	pose: pose.Crawl,
						// 	value: multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], getSizeFactor(state))
						// },


						{
							pose: pose.All,
							value: multiplyScalar([0.38, 1.2, 0.415], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
				// rotation: [0.13, 0.07, 0]
				isUseGirlRotation: true,
				// rotation: [1.64, 0, 0.12]
				rotation: [1.64, 0, -0.2]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.002
					},
				],
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.03
					},
				],
				size:

					[
						// {
						// 	pose: pose.Stand,
						// 	value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], getSizeFactor(state))
						// },
						// {
						// 	pose: pose.Pick,
						// 	value: multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], getSizeFactor(state))
						// },
						// {
						// 	pose: pose.Crawl,
						// 	value: multiplyScalar([1 / 1.7, 1 / 1.9, 1 / 2], getSizeFactor(state))
						// },

						{
							pose: pose.All,
							value: multiplyScalar([0.82, 0.47, 0.5], getSizeFactor(state))
						}
					]
				,
				isUseGirlRotation: true,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.1
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.1
				// 	},
				// 	{
				// 		pose: pose.Crawl,
				// 		value: -0.05
				// 	},
				// ],
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.02
					},
				],
				upDirectionScalar: [
					// {
					// 	pose: pose.HeavyStressingLie,
					// 	value: 0.022
					// },

					{
						pose: pose.All,
						value: 0.012
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.47, 0.2, 0.35], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
				rotation: [1.57, 0, 0]
			},
		},

		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LowBreast,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.115
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0.012
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.47, 0.3, 0.35], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
				rotation: [1.57, 0, 0]
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
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.05
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.25, 0.5, 0.25], getSizeFactor(state))
						},
					],
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
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: -0.05
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.25, 0.5, 0.25], getSizeFactor(state))
						},
					],
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
							value: multiplyScalar([1 / 8, 0.35, 0.2], getSizeFactor(state))
						},
						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.125, 0.35, 0.13], getSizeFactor(state))
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
							value: multiplyScalar([1 / 8, 0.35, 0.2], getSizeFactor(state))
						},
						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.125, 0.35, 0.13], getSizeFactor(state))
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
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Crawl,
				// 		value: 0.09
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.1
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.08
				// 	},
				// ],
				frontDirectionScalar: [
					{
						pose: pose.All,
						value: -0.06
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.72, 0.78, 0.72], getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",

				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.03
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.02
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.01
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.0
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.005
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.01
				// 	},
				// ],

				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.02
					},
					{
						pose: pose.HeavyStressingLie,
						value: 0.03
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
					{
						pose: pose.HeavyStressingLie,
						value: 0.0
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0.025
					},
					{
						pose: pose.HeavyStressingLie,
						value: 0.02
					},
				],

				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.23, 0.3, 0.25], getSizeFactor(state))
						},

						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.22, 0.2, 0.25], getSizeFactor(state))
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
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.Stand,
				// 		value: 0.04
				// 	},
				// 	{
				// 		pose: pose.Pick,
				// 		value: 0.04
				// 	},
				// ],

				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.02
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.04
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.0
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.035
				// 	},
				// 	{
				// 		pose: pose.HeavyStressingLie,
				// 		value: 0.015
				// 	},
				// ],



				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.02
					},
					{
						pose: pose.HeavyStressingLie,
						value: 0.03
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.01
					},
					{
						pose: pose.HeavyStressingLie,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0.03
					},
					{
						pose: pose.HeavyStressingLie,
						value: 0.02
					},
				],

				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0.23, 0.3, 0.25], getSizeFactor(state))
						},

						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.25, 0.2, 0.25], getSizeFactor(state))
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
			],
			collisionPart: collisionPart.LeftNipple,
			oneBone: {
				boneName: "左胸上2",
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.02
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.035
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.08
				// 	},
				// ],

				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.01
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.025
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.06
				// 	},
				// ],


				frontDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: 0.07
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: 0.04
					},
				],
				size:
					[
						// {
						// 	pose: pose.All,
						// 	value: multiplyScalar([0.06, 0.07, 0.09], getSizeFactor(state))
						// },
						{
							pose: pose.All,
							value: multiplyScalar([0, 0, 0], getSizeFactor(state))
						},
						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.06, 0.07, 0.09], getSizeFactor(state))
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
			],
			collisionPart: collisionPart.RightNipple,
			oneBone: {
				boneName: "右胸上2",
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.02
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.035
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.08
				// 	},
				// ],
				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.045
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.025
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.045
				// 	},
				// ],

				// frontDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: 0.03
				// 	},
				// ],
				// rightDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.035
				// 	},
				// ],
				// upDirectionScalar: [
				// 	{
				// 		pose: pose.All,
				// 		value: -0.07
				// 	},
				// ],

				frontDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: 0.07
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.HeavyStressingLie,
						value: 0.045
					},
				],

				size:

					[
						{
							pose: pose.All,
							value: multiplyScalar([0, 0, 0], getSizeFactor(state))
						},
						{
							pose: pose.HeavyStressingLie,
							value: multiplyScalar([0.06, 0.07, 0.11], getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},


		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightFinger,
			oneBone: {
				boneName: "右人指２",

				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.0
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0.005
					},
				],

				size: [
					{
						pose: pose.All,
						value: multiplyScalar([0.035, 0.2, 0.03], getSizeFactor(state))
					},
				],
				isUseGirlRotation: false,
				rotation: [0, 0, -0.8],
			},
		},
		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.LeftFinger,
			oneBone: {
				boneName: "左人指２",

				frontDirectionScalar: [
					{
						pose: pose.All,
						value: 0.0
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.All,
						value: -0.005
					},
				],
				upDirectionScalar: [
					{
						pose: pose.All,
						value: 0
					},
				],

				size: [
					{
						pose: pose.All,
						value: multiplyScalar([0.035, 0.2, 0.03], getSizeFactor(state))
					},
				],
				isUseGirlRotation: false,
				rotation: [0, 0, 0.8],
			},
		},
	]
}