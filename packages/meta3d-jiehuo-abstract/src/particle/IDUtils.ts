import { ArrayUtils, NullableUtils } from "../Main"
import { getLabelState, getParticleState, setParticleState } from "../state/State"
import { id, state } from "../type/StateType"
import { popLastOne, pushArrs } from "../utils/ArrayUtils"
import { nullable } from "../utils/nullable"


export let addReallocateIds = (state: state, reallocateIds) => {
	return setParticleState(state, {
		...getParticleState(state),
		reallocateIds: pushArrs(getParticleState(state).reallocateIds, reallocateIds)
	})
}

// export let addReallocateIds = (state: state, reallocateIds) => {
// 	return setParticleState(state, {
// 		...getParticleState(state),
// 		reallocateIds: ArrayUtils.pushArrs(getParticleState(state).reallocateIds, reallocateIds)
// 	})
// }

export let buildParticleId = (state: state) => {
	let { reallocateIds } = getParticleState(state)

	if (reallocateIds.length > 0) {
		return popLastOne(reallocateIds)
	}

	let id = getParticleState(state).maxId

	getParticleState(state).maxId += 1

	return id
}

export let buildInstanceParticleId = (state: state,
	isFromReallocateFunc
): [state, id, boolean] => {
	let { reallocateIds } = getParticleState(state)

	let [newReallocateIds, id] = reallocateIds.reduce<[Array<id>, nullable<id>]>(([newReallocateIds, id], reallocateId) => {
		if (NullableUtils.isNullable(id) && isFromReallocateFunc(reallocateId)) {
			return [newReallocateIds, NullableUtils.return_(reallocateId)]
		}

		return [ArrayUtils.push(newReallocateIds, reallocateId), id]
	}, [[], NullableUtils.getEmpty()])

	state = setParticleState(state, {
		...getParticleState(state),
		reallocateIds: newReallocateIds
	})

	if (!NullableUtils.isNullable(id)) {
		return [state, NullableUtils.getExn(id), true]
	}

	id = getParticleState(state).maxId

	state = setParticleState(state, {
		...getParticleState(state),
		maxId: getParticleState(state).maxId + 1
	})

	return [state, id, false]
}

// export let buildLabelId = (state: state) => {
// 	let id = getLabelState(state).maxId

// 	getLabelState(state).maxId += 1

// 	return id
// }

export let generateId = () => {
	return Math.floor(Math.random() * 1000000)
}