import { details, state } from "../../type/StateType";
import { Box3, Frustum, Matrix4, } from "three";
import { nullable } from "../../utils/nullable";
import { deepDispose } from "../../scene/utils/DisposeUtils";

export abstract class LODContainer {
	public isLODContainer = true

	public details: details = null

	public name: string

	public originBox: nullable<Box3> = null

	constructor() {
	}

	// abstract insert(transform: Matrix4, box: Box3, name: string): void

	// abstract setStatus(state:state, name: string, status_: status): this

	abstract getAllBoxes(state: state): Array<Box3>

	// abstract findBoxByName(name: string): nullable<Box3>

	abstract queryByFrustum(state: state, frustum: Frustum): [number, Array<Matrix4>, Array<string>]
	// abstract queryByFrustum(state: state, frustum: Frustum): Array<Matrix4>


	// abstract queryByCapsule(capsule: Capsule, capsuleBox: Box3, result?, transform?, box?, name?): [capsuleCollisionResult, Matrix4, Box3, string]


	// queryRangeByBox(boxRange: THREE.Box3, transforms = [], boxes = [], names = []) {
	// 	return [transforms, boxes, names]
	// }

	// queryByPoint(point: THREE.Vector3, transform = null, box = null, name = null) {
	// 	return [transform, box, name]
	// }

	computeBox() {
		return new Box3().setFromObject(this.details[0].group)
	}

	getGroup(lodIndex) {
		return this.details[lodIndex].group
	}

	private _getAllGroup() {
		return this.details.map(d => d.group)
	}

	dispose() {
		this._getAllGroup().forEach(group => {
			deepDispose(group)
		})
	}
}