import { speed } from "../data/DataType"
import { emitPrecision, emitSpeed, emitVolume } from "../data/ValueType"

export type littleManValue = {
	excitement:number,

	hp: number,
	defenseFactor: number,

	moveSpeed: speed,

	// emitSpeed: emitSpeed,
	// emitVolume: emitVolume,
	// emitPrecision: emitPrecision
}