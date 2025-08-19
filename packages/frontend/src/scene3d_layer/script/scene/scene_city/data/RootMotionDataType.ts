import { animationName } from "./DataType"

export type rootMotionData = Array<{
	name: animationName,
	value: Array<{
		frameIndexRange: [number, number],
		speedFactor: number
	}>
}>
