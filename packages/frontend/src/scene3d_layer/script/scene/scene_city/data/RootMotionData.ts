import { animationName } from "./DataType"
import { rootMotionData } from "./RootMotionDataType"

export let getRootMotionData = (): rootMotionData => {
	return [
		{
			name: animationName.Walk,
			// value: [
			// 	{
			// 		frameIndexRange: [0, 1],
			// 		// frameIndexRange: [0, 3],
			// 		speedFactor: 0.5
			// 	},
			// 	{
			// 		frameIndexRange: [2, 9],
			// 		// frameIndexRange: [4, 7],
			// 		speedFactor: 3
			// 	},
			// 	{
			// 		frameIndexRange: [10, 19],
			// 		speedFactor: 0.5
			// 	},
			// 	{
			// 		frameIndexRange: [20, 28],
			// 		speedFactor: 3
			// 	},
			// 	{
			// 		frameIndexRange: [29, 30],
			// 		speedFactor: 0.5
			// 	},
			// 	{
			// 		frameIndexRange: [31, 32],
			// 		speedFactor: 0.2
			// 	}
			// ]
			value: [
				// {
				// 	frameIndexRange: [0, 3],
				// 	speedFactor: 3
				// },
				{
					frameIndexRange: [0, 7],
					// frameIndexRange: [0, 6],
					// frameIndexRange: [4, 7],
					// speedFactor: 0.5
					speedFactor: 2
				},
				{
					frameIndexRange: [8, 10],
					// frameIndexRange: [7, 10],
					speedFactor: 5
					// speedFactor: 8
				},
				{
					frameIndexRange: [11, 16],
					speedFactor: 2
				},
				{
					frameIndexRange: [17, 18],
					// speedFactor: 1
					speedFactor: 4
				},
				{
					frameIndexRange: [19, 22],
					// speedFactor: 4
					// speedFactor: 1
					// speedFactor: 4
					speedFactor: 2
				},
				// {
				// 	frameIndexRange: [17, 18],
				// 	speedFactor: 0.5
				// },
				// {
				// 	frameIndexRange: [19, 20],
				// 	speedFactor: 0.2
				// },
				// {
				// 	frameIndexRange: [21, 22],
				// 	speedFactor: 0.5
				// },
				{
					frameIndexRange: [23, 30],
					speedFactor: 2
					// speedFactor: 4
				},
				{
					frameIndexRange: [31, 32],
					// speedFactor: 0.5
					speedFactor: 1
				},
			]
		},
		{
			name: animationName.Run,
			value: [
				{
					frameIndexRange: [0, 3],
					speedFactor: 6
				},
				{
					frameIndexRange: [4, 9],
					speedFactor: 10
				},
				{
					frameIndexRange: [10, 14],
					speedFactor: 6
				},
				{
					frameIndexRange: [15, 20],
					speedFactor: 10
				},

			]
		},
		{
			name: animationName.CrawlMove,
			value: [
				// {
				// 	frameIndexRange: [0, 39],
				// 	speedFactor: 2
				// },

				// {
				// 	frameIndexRange: [0, 7],
				// 	speedFactor: 0.5,
				// },
				// {
				// 	frameIndexRange: [8, 10],
				// 	speedFactor: 3,
				// },
				// {
				// 	frameIndexRange: [11, 24],
				// 	speedFactor: 0.5,
				// },
				// {
				// 	frameIndexRange: [25, 30],
				// 	speedFactor: 3,
				// },
				// {
				// 	frameIndexRange: [31, 37],
				// 	speedFactor: 0.5,
				// },
				// {
				// 	frameIndexRange: [38, 39],
				// 	speedFactor: 3,
				// },

				{
					frameIndexRange: [0, 7],
					speedFactor: 2,
				},
				{
					frameIndexRange: [8, 10],
					speedFactor: 0.5,
				},
				{
					frameIndexRange: [11, 29],
					speedFactor: 2,
				},
				{
					frameIndexRange: [30, 31],
					speedFactor: 0.5,
				},
				{
					frameIndexRange: [32, 39],
					speedFactor: 2,
				},

			]
		}
	]
}
