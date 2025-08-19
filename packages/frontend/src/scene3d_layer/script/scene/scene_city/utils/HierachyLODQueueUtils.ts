import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { state } from "../../../../type/StateType"
import { LOD } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { NullableUtils } from "meta3d-jiehuo-abstract"

// export let update = (state: state, parentWorldMatrix: nullable<Matrix4>, allNeedUpdateIndices: Array<number>) => {
// 	let originBox = this.originBox

// 	let isNeedUpdateBox = !NullableUtils.isNullable(originBox)

// 	if (isNeedUpdateBox) {
// 		originBox = NullableUtils.getExn(originBox)
// 	}

// 	allNeedUpdateIndices.forEach(i => {
// 		let worldTransform = this._worldTransforms[i]
// 		let transform = this.transforms[i]

// 		if (isNullable(parentWorldMatrix)) {
// 			worldTransform.copy(transform)
// 		}
// 		else {
// 			worldTransform.multiplyMatrices(getExn(parentWorldMatrix), transform)
// 		}

// 		// markNeedsUpdate(state, i, false)


// 		if (isNeedUpdateBox) {
// 			this.boxes[i].copy(originBox.clone().applyMatrix4(worldTransform)
// 			)
// 		}

// 		this._children.forEach(childQueue => {
// 			// childQueue.update(state, return_(worldTransform), allNeedUpdateIndices)
// 			childQueue.update(state, return_(worldTransform), [i])
// 		})
// 	})

// }

export let update = (state: state, topParentQueue: HierachyLODQueue) => {
	let allNeedUpdateIndices = topParentQueue.getAllIndices().filter(index => LOD.isNeedsUpdate(getAbstractState(state), topParentQueue.name, index))

	allNeedUpdateIndices.forEach(index => {
		topParentQueue.update(getAbstractState(state), NullableUtils.getEmpty(), index)
	})

	topParentQueue.getAllIndices().forEach(index => {
		LOD.markNeedsUpdate(getAbstractState(state), topParentQueue.name, index, false)
	})
}