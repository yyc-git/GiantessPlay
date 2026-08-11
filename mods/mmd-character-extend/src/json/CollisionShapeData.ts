import { collisionPart, data, pose } from "mmd-character-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { mmdCharacter } from "./Type"

export let getData = (
	api: api,
	state: state): data<mmdCharacter, pose, collisionPart> => {
	return ([
		{
			mmds: [
				mmdCharacter.Meiko,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				size: [
					{
						pose: pose.All,
						value: api.multiplyScalar([1.6 / 5, 1.6 / 6, 1.6 / 2.2], api.getSizeFactor(state))
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
						value: api.multiplyScalar([1.6 / 5, 1.6 / 6, 1.6 / 2.2], api.getSizeFactor(state))
					},
				]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Nero,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.06
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 0.57], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Nero,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.06
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 0.57], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.06
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.05
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 0.62], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.06
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.05
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 0.62], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
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
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.08
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
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
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.08
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3.5, 1.6 / 3.2], api.getSizeFactor(state))
							// value: api.multiplyScalar([1.6 / 6, 1.6 / 4.5, 1.6 / 3.2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.03
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.27, 0.6, 0.44], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
			// oneBone: {
			// 	boneName: "右足首",
			// 	frontDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: 0.03
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: 0.03
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.1
			// 		},
			// 	],
			// 	upDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: -0.08
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: -0.08
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.03
			// 		},
			// 	],
			// 	size:

			// 		[
			// 			{
			// 				pose: pose.Stand,
			// 				value: api.multiplyScalar([0.27,0.6,0.455], api.getSizeFactor(state))
			// 			},
			// 			{
			// 				pose: pose.Pick,
			// 				value: api.multiplyScalar([0.27,0.6,0.455], api.getSizeFactor(state))
			// 			},
			// 			{
			// 				pose: pose.Crawl,
			// 				value: api.multiplyScalar([0.27,0.45,0.45], api.getSizeFactor(state))
			// 			},
			// 		]
			// 	,
			// },
		},
		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.03
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.27, 0.6, 0.44], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
			// oneBone: {
			// 	boneName: "左足首",
			// 	frontDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: 0.03
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: 0.03
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.1
			// 		},
			// 	],
			// 	upDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: -0.08
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: -0.08
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.03
			// 		},
			// 	],
			// 	size:

			// 		[
			// 			{
			// 				pose: pose.Stand,
			// 				value: api.multiplyScalar([0.27,0.6,0.455], api.getSizeFactor(state))
			// 			},
			// 			{
			// 				pose: pose.Pick,
			// 				value: api.multiplyScalar([0.27,0.6,0.455], api.getSizeFactor(state))
			// 			},
			// 			{
			// 				pose: pose.Crawl,
			// 				value: api.multiplyScalar([0.27,0.45,0.45], api.getSizeFactor(state))
			// 			},
			// 		]
			// 	,
			// },
		},

		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.RightFoot,

			// /*! because this pmx has 右つま先ＩＫ調整 which may affect 右つま先ＩＫ to make it to null by getBone, so not use this bone!
			// * 
			// */
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				// centerFactor: 0.65,
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: 0.03
					// },
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.27, 0.8, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
			// oneBone: {
			// 	boneName: "右足首",
			// 	frontDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: 0.04
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: 0.04
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.15
			// 		},
			// 	],
			// 	upDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: -0.15
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: -0.15
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.05
			// 		},
			// 	],
			// 	size:

			// 		[
			// 			{
			// 				pose: pose.All,
			// 				value: api.multiplyScalar([0.27, 0.78, 0.6], api.getSizeFactor(state))
			// 			},
			// 		]
			// 	,
			// },
		},
		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: 0.03
					// },
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.27, 0.8, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
			// oneBone: {
			// 	boneName: "左足首",
			// 	frontDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: 0.04
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: 0.04
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.15
			// 		},
			// 	],
			// 	upDirectionScalar: [
			// 		{
			// 			pose: pose.Stand,
			// 			value: -0.15
			// 		},
			// 		{
			// 			pose: pose.Pick,
			// 			value: -0.15
			// 		},
			// 		{
			// 			pose: pose.Crawl,
			// 			value: -0.05
			// 		},
			// 	],
			// 	size:

			// 		[
			// 			{
			// 				pose: pose.All,
			// 				value: api.multiplyScalar([0.27, 0.78, 0.6], api.getSizeFactor(state))
			// 			},
			// 		]
			// 	,
			// },
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.11
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.03
						// value: -0.04
						value: -0.02
					},
					{
						pose: pose.Pick,
						// value: -0.03
						value: -0.02
					},
					{
						pose: pose.Crawl,
						value: 0
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 0.6, 0.53], api.getSizeFactor(state))
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.11
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.03
						// value: -0.04
						value: -0.02
					},
					{
						pose: pose.Pick,
						// value: -0.03
						value: -0.02
					},
					{
						pose: pose.Crawl,
						value: 0
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 0.6, 0.53], api.getSizeFactor(state))
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
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3, 0.55], api.getSizeFactor(state))
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
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1.6 / 6, 1.6 / 3, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
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
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.055
					},
					{
						pose: pose.Pick,
						value: -0.055
					},
					{
						pose: pose.Crawl,
						value: 0.04
					},
					{
						pose: pose.Sit,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.67, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.67, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.63, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Youye,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
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
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.055
					},
					{
						pose: pose.Pick,
						value: -0.055
					},
					{
						pose: pose.Crawl,
						value: 0.04
					},
					{
						pose: pose.Sit,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.67, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.67, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.63, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.04
					// },
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
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
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.67, 0.76], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.67, 0.76], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.63, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.04
					// },
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
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
						value: -0.01
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.67, 0.76], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.67, 0.76], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.63, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Sunxiaomei
			],
			collisionPart: collisionPart.RightFoot,
			oneBone: {
				boneName: "右足ＩＫ",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.13
					},
					{
						pose: pose.Pick,
						value: 0.13
					},
					{
						pose: pose.Crawl,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: 0.09
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Crawl,
						value: -0.14
					},
					{
						pose: pose.Sit,
						value: 0.1
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.4, 0.45, 0.95], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.4, 0.45, 0.95], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.4, 0.95, 0.5], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.4, 0.95, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Sunxiaomei
			],
			collisionPart: collisionPart.LeftFoot,
			oneBone: {
				boneName: "左足ＩＫ",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.13
					},
					{
						pose: pose.Pick,
						value: 0.13
					},
					{
						pose: pose.Crawl,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: 0.09
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Crawl,
						value: -0.14
					},
					{
						pose: pose.Sit,
						value: 0.1
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.4, 0.45, 0.95], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.4, 0.45, 0.95], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.4, 0.95, 0.5], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.4, 0.95, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
					{
						pose: pose.Crawl,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.35, 0.68], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.35, 0.68], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.48, 0.57], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.27, 0.68, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.65,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
					{
						pose: pose.Crawl,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.27, 0.35, 0.68], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.27, 0.35, 0.68], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.48, 0.57], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.27, 0.68, 0.4], api.getSizeFactor(state))
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				size: [
					{
						pose: pose.Stand,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Pick,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Crawl,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Sit,
						value: api.multiplyScalar([0.25, 0.8, 0.6], api.getSizeFactor(state))
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				size: [
					{
						pose: pose.Stand,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Pick,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Crawl,
						value: api.multiplyScalar([0.25, 0.5, 0.85], api.getSizeFactor(state))
					},
					{
						pose: pose.Sit,
						value: api.multiplyScalar([0.25, 0.8, 0.6], api.getSizeFactor(state))
					},
				],
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.25, 0.4, 0.6], api.getSizeFactor(state))
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
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.25, 0.4, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				//mmdCharacter.Baixi_Maid,
				mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.RightFoot,
			twoBones: {
				bone1Name: "右つま先ＩＫ",
				bone2Name: "右足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.05
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},

					{
						pose: pose.Crawl,
						value: 0.02
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:
					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1.6 / 6, 0.6, 0.7], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				//mmdCharacter.Baixi_Maid,
				mmdCharacter.Vanilla,
			],
			collisionPart: collisionPart.LeftFoot,
			twoBones: {
				bone1Name: "左つま先ＩＫ",
				bone2Name: "左足ＩＫ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.05
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},

					{
						pose: pose.Crawl,
						value: 0.02
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:
					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1.6 / 6, 0.3, 0.63333], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1.6 / 6, 0.6, 0.7], api.getSizeFactor(state))
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
			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.15, 0, 0]
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.15, 0, 0]
			},
		},

		{
			mmds: [
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
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 0.35], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.15, 0, 0]
			},
		},
		{
			mmds: [
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
				upDirectionScalar: [
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1 / 4, 1 / 0.8, 0.35], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.15, 0, 0]
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
					{
						pose: pose.Crawl,
						value: 0.03
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.3, 1.25, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.1, 0, 0]
			},
		},
		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
					{
						pose: pose.Crawl,
						value: 0.03
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.3, 1.25, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0.1, 0, 0]
			},
		},


		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: 0.03
					// },
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 1.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: 0.03
					// },
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 1.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
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
							value: api.multiplyScalar([0.3, 1.25, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
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
							value: api.multiplyScalar([0.3, 1.25, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.05
					},
					{
						pose: pose.Pick,
						value: 0.05
					},
					{
						pose: pose.Sit,
						value: -0.03
					},

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.35, 1.5, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.05
					},
					{
						pose: pose.Pick,
						value: 0.05
					},
					{
						pose: pose.Sit,
						value: -0.03
					},

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.35, 1.5, 0.3], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.35, 1.5, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.LeftShank,
			twoBones: {
				bone1Name: "左足首",
				bone2Name: "左ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 1.25, 0.4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.RightShank,
			twoBones: {
				bone1Name: "右足首",
				bone2Name: "右ひざ",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 1.25, 0.4], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 4, 1 / 0.66, 1 / 4], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 4, 1 / 0.66, 1 / 4], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 3.5, 1 / 0.9, 1 / 2.5], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 3.5, 1 / 0.9, 1 / 2.5], api.getSizeFactor(state))
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
				//mmdCharacter.Baixi_Maid,
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
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], api.getSizeFactor(state))
						},

						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], api.getSizeFactor(state))
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
				//mmdCharacter.Baixi_Maid,
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
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 2], api.getSizeFactor(state))
						},

						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 3, 1 / 1.1, 1 / 3], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 0.8, 0.5], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.02
					},
					{
						pose: pose.Pick,
						value: -0.02
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 0.8, 0.5], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
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
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.65, 0.9, 0.67], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },
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
					// {
					// 	pose: pose.Crawl,
					// 	value: -0.05
					// },

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.65, 0.9, 0.67], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.54, 0.88, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				// upDirectionScalar: -0.03,
				rightDirectionScalar: [
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
							value: api.multiplyScalar([0.54, 0.88, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},

		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.54, 0.85, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.54, 0.85, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},


		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.LeftThigh,
			twoBones: {
				bone1Name: "左ひざ",
				bone2Name: "左足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 1, 0.5], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
			},
		},
		{
			mmds: [
				mmdCharacter.Noah,

			],
			collisionPart: collisionPart.RightThigh,
			twoBones: {
				bone1Name: "右ひざ",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 1, 0.5], api.getSizeFactor(state))
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
						value: api.multiplyScalar([1 / 1.2, 1 / 3, 1 / 1.5], api.getSizeFactor(state))
					},
					{
						pose: pose.Pick,
						value: api.multiplyScalar([1 / 1.2, 1 / 3, 1 / 1.5], api.getSizeFactor(state))
					},
					{
						pose: pose.Crawl,
						value: api.multiplyScalar([1 / 1.8, 1 / 2.2, 1 / 2.2], api.getSizeFactor(state))
					},
				]
				,
				isUseGirlRotation: true,
			},
		},
		{
			mmds: [
				//mmdCharacter.Baixi_Maid,
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
							value: api.multiplyScalar([1 / 1.4, 1 / 3, 1 / 1.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 1.4, 1 / 3, 1 / 1.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 1.4, 1 / 2.5, 1 / 1.7], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 1.7, 1 / 3, 1 / 1.8], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 1.7, 1 / 1.9, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.9, 0.5, 0.7], api.getSizeFactor(state))
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
							value: api.multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 1.7, 1 / 3, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 1.7, 1 / 1.9, 1 / 2], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.8, 1 / 1.9, 1 / 2], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
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
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.02
					},

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1, 0.4, 0.65], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1, 0.4, 0.65], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1, 0.6, 0.65], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},


		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Crawl,
						value: 0.05
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.04
					},
					{
						pose: pose.Pick,
						value: 0.04
					},
					{
						pose: pose.Crawl,
						value: 0.04
					},

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1.25, 0.55, 0.85], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1.25, 0.55, 0.85], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1.25, 0.75, 0.85], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1.25, 0.75, 0.95], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},

		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.01
					},

				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.06
					},
					{
						pose: pose.Pick,
						value: 0.06
					},
					// {
					// 	pose: pose.Crawl,
					// 	value: 0.02
					// },

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1, 0.4, 0.6], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1, 0.4, 0.6], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1, 0.48, 0.6], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},

		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
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
						value: 0.03
					},

				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						value: 0.01
					},
					{
						pose: pose.Sit,
						value: -0.02,
					},

				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1.1, 0.4, 0.8], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1.1, 0.4, 0.8], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1.1, 0.4, 0.8], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1.1, 0.5, 0.8], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: true,
			},
		},

		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.TrigoneAndButt,
			twoBones: {
				bone1Name: "左足",
				bone2Name: "右足",
				centerFactor: 0.5,
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.02
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
							pose: pose.Stand,
							value: api.multiplyScalar([1.1, 0.3, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1.1, 0.3, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1.1, 0.55, 0.7], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([1.1, 0.55, 0.7], api.getSizeFactor(state))
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
					{
						pose: pose.Sit,
						value: 0.17
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
					{
						pose: pose.Sit,
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
					{
						pose: pose.Sit,
						value: 0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
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
					{
						pose: pose.Sit,
						value: 0.17
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
					{
						pose: pose.Sit,
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
					{
						pose: pose.Sit,
						value: 0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Meiko,
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
					{
						pose: pose.Sit,
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
					{
						pose: pose.Sit,
						value: 0.06
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
					{
						pose: pose.Sit,
						value: 0.14
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 4, 0.35], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Meiko,
				mmdCharacter.Moye,
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
					{
						pose: pose.Sit,
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
					{
						pose: pose.Sit,
						value: -0.06
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
					{
						pose: pose.Sit,
						value: 0.14
					},
				],
				size:

					[
						{
							pose: pose.All,
							// value: api.multiplyScalar([1 / 3, 1 / 4, 1 / 4], api.getSizeFactor(state))
							value: api.multiplyScalar([1 / 3, 1 / 4, 0.35], api.getSizeFactor(state))
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
					{
						pose: pose.Sit,
						value: 0.17
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
					{
						pose: pose.Sit,
						value: 0.08
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
					{
						pose: pose.Sit,
						value: 0.17
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 5, 1 / 4, 1 / 4.5], api.getSizeFactor(state))
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
					{
						pose: pose.Sit,
						value: 0.17
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
					{
						pose: pose.Sit,
						value: -0.08
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
					{
						pose: pose.Sit,
						value: 0.17
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 5, 1 / 4, 1 / 4.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Haku_QP
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
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.3, 0.25], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Haku_QP
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
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.03
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([1 / 3, 1 / 3, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.27, 0.3, 0.25], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Lipusi,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸２",
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.03
					},
					{
						pose: pose.Pick,
						value: 0.03
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
							value: api.multiplyScalar([0.42, 0.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Lipusi,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸２",
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
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
							value: api.multiplyScalar([0.42, 0.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Ciming,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸7",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.1
					},
					{
						pose: pose.Pick,
						value: -0.1
					},
					{
						pose: pose.Crawl,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: -0.1
					},
				],
				rightDirectionScalar: [
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
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						value: 0.1
					},
					{
						pose: pose.Sit,
						value: 0.09
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 0.6, 0.7], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Ciming,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸7",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.1
					},
					{
						pose: pose.Pick,
						value: -0.1
					},
					{
						pose: pose.Crawl,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: -0.1
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.03
					},
					{
						pose: pose.Pick,
						value: 0.03
					},
					{
						pose: pose.Crawl,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						value: 0.1
					},
					{
						pose: pose.Sit,
						value: 0.09
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 0.6, 0.7], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
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
						// value: -0.07
						value: -0.09
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Pick,
						value: -0.06
					},
					{
						pose: pose.Crawl,
						value: 0.02
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.3, 0.3, 0.32], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
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
						// value: -0.07
						value: -0.09
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Pick,
						value: -0.06
					},
					{
						pose: pose.Crawl,
						value: 0.02
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.3, 0.3, 0.32], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "breast_L.002_2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.07
					},
					{
						pose: pose.Pick,
						value: -0.07
					},
					{
						pose: pose.Crawl,
						value: 0.01
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: 0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 0.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "breast_R.002_2",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.07
					},
					{
						pose: pose.Pick,
						value: -0.07
					},
					{
						pose: pose.Crawl,
						value: 0.01
					},
					{
						pose: pose.Sit,
						value: -0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: 0.02
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.4, 0.5, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.07
					},
					{
						pose: pose.Pick,
						value: 0.07
					},
					{
						pose: pose.Crawl,
						value: -0.02
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.01
					},
					{
						pose: pose.Pick,
						value: 0.01
					},
					{
						pose: pose.Crawl,
						value: 0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.07
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.35, 0.4, 0.4], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.07
					},
					{
						pose: pose.Pick,
						value: 0.07
					},
					{
						pose: pose.Crawl,
						value: -0.02
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: -0.01
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Crawl,
						value: -0.07
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.35, 0.4, 0.4], api.getSizeFactor(state))
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
						// value: 0.08
						value: 0.06
					},
					{
						pose: pose.Pick,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: 0.07
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.03
					},
					{
						pose: pose.Pick,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						// value: -0.07
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							// value: api.multiplyScalar([1 / 3, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
							value: api.multiplyScalar([1 / 3, 1 / 2.5, 0.35], api.getSizeFactor(state))
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
						// value: 0.08
						value: 0.06
					},
					{
						pose: pose.Pick,
						value: 0.06
					},
					{
						pose: pose.Sit,
						value: 0.07
					},
				],
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.02
					},
					{
						pose: pose.Pick,
						value: 0.02
					},
					{
						pose: pose.Crawl,
						// value: -0.07
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.01
					},
				],
				size:

					[
						{
							pose: pose.All,
							// value: api.multiplyScalar([1 / 3, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
							value: api.multiplyScalar([1 / 3, 1 / 2.5, 0.35], api.getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [
				mmdCharacter.Changee,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 2.7, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Changee,
				mmdCharacter.Xiaye2,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.02
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 2.7, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [
				mmdCharacter.Xiaye1,
			],
			collisionPart: collisionPart.LeftBreast,
			oneBone: {
				boneName: "左胸上2",
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
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 2.7, 0.35], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Xiaye1,
			],
			collisionPart: collisionPart.RightBreast,
			oneBone: {
				boneName: "右胸上2",
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
						// value: -0.04
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						// value: -0.02
						value: -0.04
					},
					{
						pose: pose.Pick,
						value: -0.04
					},
					{
						pose: pose.Sit,
						value: -0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 3, 1 / 2.7, 0.35], api.getSizeFactor(state))
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
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.03
					},
					{
						pose: pose.Pick,
						value: 0.03
					},
				],
				size:

					[
						{
							pose: pose.All,
							// value: api.multiplyScalar([1 / 4, 1 / 3, 1 / 3], api.getSizeFactor(state))
							value: api.multiplyScalar([0.3, 1 / 3, 1 / 3], api.getSizeFactor(state))
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
				rightDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.03
					},
					{
						pose: pose.Pick,
						value: -0.03
					},
				],
				size:

					[
						{
							pose: pose.All,
							// value: api.multiplyScalar([1 / 4, 1 / 3, 1 / 3], api.getSizeFactor(state))
							value: api.multiplyScalar([0.3, 1 / 3, 1 / 3], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Meiko,

				mmdCharacter.Haku_QP,
				mmdCharacter.Haku_Lady,
				mmdCharacter.Nero,
				mmdCharacter.Xiaye1,
				mmdCharacter.Xiaye2,
				mmdCharacter.XiaHui,
				mmdCharacter.Youye,
				mmdCharacter.Kongzhilvzhe,
				mmdCharacter.Qiyana,
				mmdCharacter.Sunxiaomei,
				mmdCharacter.Noah,
				mmdCharacter.Moye,
				mmdCharacter.Miku1,
				mmdCharacter.Changee,
				mmdCharacter.Vanilla,
				mmdCharacter.Meibiwusi,

				mmdCharacter.Lipusi,
				mmdCharacter.Ciming,

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
					{
						pose: pose.Sit,
						value: 0.04
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
					{
						pose: pose.Sit,
						value: 0.08
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 1.3, 1 / 1.3, 1 / 1.3], api.getSizeFactor(state))
						},
					]
				,
				// isUseGirlRotation: false,
			},
		},

		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

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
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.13
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
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
					{
						pose: pose.Sit,
						value: 0.11
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 2, 1 / 1, 1 / 2.7], api.getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [mmdCharacter.Haku_QP,
			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

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
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.13
					},
					{
						pose: pose.Sit,
						value: 0.05
					},
				],
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
					{
						pose: pose.Sit,
						value: 0.11
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 2, 1 / 1, 1 / 2.7], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Lipusi,

			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
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
						value: 0.2
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.17
					},
					{
						pose: pose.Pick,
						value: 0.17
					},
					{
						pose: pose.Crawl,
						value: -0.06
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.6, 1.15, 0.5], api.getSizeFactor(state))
						},
					]
				,
			},
		},

		{
			mmds: [
				mmdCharacter.Ciming,

			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
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
						value: 0.18
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.19
					},
					{
						pose: pose.Pick,
						value: 0.19
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
							value: api.multiplyScalar([0.6, 1.1, 0.55], api.getSizeFactor(state))
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
				frontDirectionScalar: [
					{
						pose: pose.Crawl,
						value: 0.13
					},
					{
						pose: pose.Sit,
						value: 0.02
					},
				],
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
					{
						pose: pose.Sit,
						value: 0.04
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([1 / 2, 1 / 1, 1 / 2.3], api.getSizeFactor(state))
						},
					]
				,
			},
		},


		{
			mmds: [
				mmdCharacter.Youye,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
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
						value: 0.2
					},
					{
						pose: pose.Sit,
						value: 0.07
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.24
					},
					{
						pose: pose.Pick,
						value: 0.24
					},
					{
						pose: pose.Crawl,
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: 0.15
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 1.2, 0.55], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Kongzhilvzhe,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.12
					},
					{
						pose: pose.Sit,
						value: 0.03
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.15
					},
					{
						pose: pose.Pick,
						value: 0.15
					},
					{
						pose: pose.Crawl,
						value: -0.05
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([0.5, 1.2, 0.45], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.5, 1.2, 0.45], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([0.5, 1.2, 0.45], api.getSizeFactor(state))
						},
						{
							pose: pose.Sit,
							value: api.multiplyScalar([0.5, 1, 0.45], api.getSizeFactor(state))
						},
					]
				,
			},
		},
		{
			mmds: [
				mmdCharacter.Qiyana,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
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
						value: 0.2
					},
					{
						pose: pose.Sit,
						value: 0.06
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.19
					},
					{
						pose: pose.Pick,
						value: 0.19
					},
					{
						pose: pose.Crawl,
						value: -0.07
					},
					{
						pose: pose.Sit,
						value: 0.07
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.5, 1.1, 0.53], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.15, 0, 0],
			},
		},


		{
			mmds: [
				mmdCharacter.Sunxiaomei,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.15
					},
					{
						pose: pose.Sit,
						value: 0.04
					},
				],
				upDirectionScalar: [
					{
						pose: pose.Stand,
						value: 0.21
					},
					{
						pose: pose.Pick,
						value: 0.21
					},
					{
						pose: pose.Crawl,
						value: -0.06
					},
					{
						pose: pose.Sit,
						value: 0.11
					},
				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.9, 1.5, 0.67], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.1, 0, 0],
			},
		},


		{
			mmds: [
				mmdCharacter.Noah,
			],
			collisionPart: collisionPart.Torso,
			oneBone: {
				boneName: "上半身",
				frontDirectionScalar: [
					{
						pose: pose.Stand,
						value: -0.01
					},
					{
						pose: pose.Pick,
						value: -0.01
					},
					{
						pose: pose.Crawl,
						value: 0.18
					},
					{
						pose: pose.Sit,
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
						value: -0.07
					},
					{
						pose: pose.Sit,
						value: 0.08
					},

				],
				size:

					[
						{
							pose: pose.All,
							value: api.multiplyScalar([0.63, 1.15, 0.55], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [-0.15, 0, 0],
			},
		},



		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,
			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
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
							value: api.multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,
			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
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
							value: api.multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},

		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
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
							value: api.multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Meiko, mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
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
							value: api.multiplyScalar([1 / 4, 1 / 1.2, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},


		{
			mmds: [
				mmdCharacter.Meibiwusi,
			],
			collisionPart: collisionPart.RightHand,
			twoBones: {
				bone1Name: "右中指３",
				bone2Name: "右手首",
				centerFactor: 0.4,
				upDirectionScalar: [
					{
						pose: pose.Pick,
						value: 0.01
					},
				],
				size:

					[
						{
							pose: pose.Stand,
							value: api.multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
						},
						{
							pose: pose.Pick,
							value: api.multiplyScalar([0.175, 0.25, 0.25], api.getSizeFactor(state))
						},
						{
							pose: pose.Crawl,
							value: api.multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},


		{
			mmds: [mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

			mmdCharacter.Meiko,
			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
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
							value: api.multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, Math.PI / 3.2],
			},
		},
		{
			mmds: [mmdCharacter.Haku_QP, mmdCharacter.Lipusi,
			mmdCharacter.Ciming,

			mmdCharacter.Haku_Lady,
			//mmdCharacter.Baixi_Maid,

			mmdCharacter.Meiko,
			mmdCharacter.XiaHui,
			mmdCharacter.Youye,
			mmdCharacter.Kongzhilvzhe,
			mmdCharacter.Qiyana,
			mmdCharacter.Sunxiaomei,
			mmdCharacter.Noah,
			mmdCharacter.Moye,
			mmdCharacter.Miku1,
			mmdCharacter.Nero,
			mmdCharacter.Changee,
			mmdCharacter.Xiaye1,
			mmdCharacter.Vanilla,
			mmdCharacter.Xiaye2,
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
							value: api.multiplyScalar([1 / 8, 1 / 2.5, 1 / 4], api.getSizeFactor(state))
						},
					]
				,
				isUseGirlRotation: false,
				rotation: [0, 0, -Math.PI / 3.2],
			},
		},
	] as any)
}