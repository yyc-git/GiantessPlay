import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { convertPositionFromBlenderToThreejs, convertQuaternionFromBlenderToThreejs } from "./BlenderUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { Box3, Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, writeState } from "../../../../state/State"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Collision } from "meta3d-jiehuo-abstract"
import { isTreesAndProps } from "../manage/city1/TreesAndProps"
import { isEliteGiantessLODQueue } from "../../../../mod/EliteGiantessMod"
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { climbDirection, objectStateName } from "../type/StateType"
import { computeClimbMovableVelocity } from "../little_man/climb/ClimbManager"
import { getNearestUsedGirl } from "./CollisionUtils"

const _q1 = new Quaternion();
const _q2 = new Quaternion();
const _e1 = new Euler();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _m1 = new Matrix3();


// export type position = [number, number, number]
export type position = [number, number]

// export type singleMoveData = {
// 	// time: number,
// 	position: position,
// 	quaternion: [number, number, number, number]
// }
export type singleMoveData = position

// let _convertSingleMoveDataFromBlenderToThreejs = (data: singleMoveData) => {
// 	return {
// 		...data,
// 		position: convertPositionFromBlenderToThreejs(data.position),
// 		quaternion: convertQuaternionFromBlenderToThreejs(data.quaternion),
// 	}
// }

let _convertSingleMoveDataFromBlenderToThreejs = (data: singleMoveData) => {
	return convertPositionFromBlenderToThreejs(data)
}

let _convertPositionToVec3 = (position: position, target: Vector3) => {
	return target.set(position[0], 0, position[1])
}

export let getMoveData = (userData: any, state: state): Array<singleMoveData> => {
	let value = JSON.parse(MutableRecordUtils.getExn(userData, "moveData")).map(_convertSingleMoveDataFromBlenderToThreejs)

	return ensureCheck(value, value => {
		test("length should >= 2", () => {
			return value.length >= 2
		})
	}, getIsDebug(state))
}

export let computeMoveTime = (previousPosition, nextPosition, factor) => {
	let dx = previousPosition[0] - nextPosition[0], dz = previousPosition[1] - nextPosition[1]

	let distance = Math.sqrt(dx * dx + dz * dz)

	if (distance < 20) {
		return 500 * factor
	}

	// return Math.min(100000, distance * (1000 + 1000 * Math.random()) / 20 * factor)
	return distance * (1000 + 1000 * Math.random()) / 20 * factor
}

// TODO remove
export let computeEuler = (previousPosition: position, nextPosition: position, initialEulerToFaceNegativeX: Euler): nullable<Euler> => {
	// requireCheck(() => {
	// 	test("y should be equal", () => {
	// 		return previousPosition[1] == nextPosition[1]
	// 	})
	// }, true)

	/*!now only support 4 directions*/
	let eulerY
	if (nextPosition[0] > previousPosition[0]) {
		eulerY = Math.PI
	}
	else if (nextPosition[0] < previousPosition[0]) {
		eulerY = 0
	}
	else if (nextPosition[1] > previousPosition[1]) {
		eulerY = Math.PI / 2
	}
	else if (nextPosition[1] < previousPosition[1]) {
		eulerY = -Math.PI / 2
	}
	else {
		return NullableUtils.getEmpty()
	}

	// return NullableUtils.return_(initialEulerToFaceNegativeX.clone().set(
	// 	initialEulerToFaceNegativeX.x,
	// 	initialEulerToFaceNegativeX.y + eulerY,
	// 	initialEulerToFaceNegativeX.z,
	// ))
	return NullableUtils.return_(new Euler().setFromQuaternion(_q1.setFromEuler(initialEulerToFaceNegativeX).premultiply(
		_q2.setFromEuler(
			_e1.set(0, eulerY, 0)
		)
	)))
}

export let computeQuaternion = (previousPosition: position, nextPosition: position, initialEulerToFaceNegativeX: nullable<Euler>): Quaternion => {
	let quaternion = TransformUtils.getLookatQuaternion(_convertPositionToVec3(previousPosition, _v1), _convertPositionToVec3(nextPosition, _v2))

	return NullableUtils.getWithDefault(
		NullableUtils.map(initialEulerToFaceNegativeX => {
			return _q1.setFromEuler(initialEulerToFaceNegativeX).premultiply(quaternion)
		}, initialEulerToFaceNegativeX),
		quaternion
	)
}

export let buildMultipleTweens = (state: state, [onUpdateFunc, createObjectFunc, onStartFunc, getTimeFunc], data): Promise<[state, nullable<tween>, Array<tween>]> => {
	let object = createObjectFunc(data[0])

	let allTweens = []

	if (data.length == 1) {
		// state = updateForOneDataFunc(state, data)
		return onUpdateFunc(state, object, data[0]).then(state => {
			return [state, NullableUtils.getEmpty(), allTweens]
		})
	}

	let [_, [firstTween, lastTween]] = data.slice(1).reduce(([[previousTween, previousData], [firstTween, lastTween]]: any, currentData, i) => {
		let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
			.to(createObjectFunc(currentData), getTimeFunc(previousData, currentData))
			.onUpdate(() => {
				return onUpdateFunc(readState(), object, currentData).then(writeState)
			})
			.onStart(() => {
				writeState(onStartFunc(readState(), previousData, currentData))

				return Promise.resolve()
			}).onComplete(() => {
				ArticluatedAnimation.removeTween(getAbstractState(readState()), tween)

				return Promise.resolve()
			})

		allTweens.push(tween)

		ArticluatedAnimation.addTween(getAbstractState(state), tween)

		if (NullableUtils.isNullable(previousTween)) {
			tween.start()
		}
		else {
			previousTween = NullableUtils.getExn(previousTween)

			previousTween.chain(tween)
		}

		if (i == 0) {
			firstTween = tween
		}
		if (i == data.length - 2) {
			lastTween = tween
		}

		return [[NullableUtils.return_(tween), currentData], [
			firstTween,
			lastTween
		]]
	}, [[NullableUtils.getEmpty(), data[0]], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])

	return Promise.resolve([state, NullableUtils.return_(lastTween), allTweens])
}

export let buildMultipleTweensForCrowd = (state: state, [onUpdateFunc, createObjectFunc, onStartFunc], data: Array<singleMoveData>, factor = 1): [state, Array<tween>] => {
	let object = createObjectFunc(data[0])

	let allTweens = []

	if (data.length == 1) {
		state = onUpdateFunc(state, object, data[0])

		return [state, allTweens]
	}

	let [_, [firstTween, lastTween]] = data.slice(1).reduce(([[previousTween, previousData], [firstTween, lastTween]]: any, currentData, i) => {
		let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
			.to(createObjectFunc(currentData), computeMoveTime(previousData, currentData, factor))
			.onUpdate(() => {
				state = onUpdateFunc(readState(), object, currentData)

				writeState(state)

				return Promise.resolve()
			})
			.onStart(() => {
				writeState(onStartFunc(readState(), previousData, currentData))

				return Promise.resolve()
			})

		allTweens.push(tween)

		ArticluatedAnimation.addTween(getAbstractState(state), tween)

		if (NullableUtils.isNullable(previousTween)) {
			tween.start()
		}
		else {
			previousTween = NullableUtils.getExn(previousTween)

			previousTween.chain(tween)
		}

		if (i == 0) {
			firstTween = tween
		}
		if (i == data.length - 2) {
			lastTween = tween
		}

		return [[NullableUtils.return_(tween), currentData], [
			firstTween,
			lastTween
		]]
	}, [[NullableUtils.getEmpty(), data[0]], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])


	lastTween.onComplete(() => {
		firstTween.start()
	})

	return [state, allTweens]
}

export let queryBoxCollision = (abstractState, specificState, queryBox, isOnlyCollisionWithStatic, isNotCollisionWithEliteGiantess) => {
	let containers = Collision.getPlayerMoveCollisionableContainers(abstractState)

	if (isNotCollisionWithEliteGiantess) {
		containers = containers.filter(queue => !isEliteGiantessLODQueue(specificState, queue))
	}

	let data = Collision.queryBoxCollision(abstractState,
		containers,
		queryBox, isOnlyCollisionWithStatic)

	// return NullableUtils.bind(data => {
	// 	if (isTreesAndProps(data[2])) {
	// 		return NullableUtils.getEmpty<[Matrix4, Box3, string]>()
	// 	}

	// 	return NullableUtils.return_(data)
	// }, data)
	return data
}

let _rayIntersectBox = (origin: Vector3, direction: Vector3, box: Box3): { t: number, normal: Vector3 } | null => {
	// 确保方向是归一化的
	if (Math.abs(direction.lengthSq() - 1) > 1e-5) {
		console.warn("Direction vector should be normalized");
		direction = direction.clone().normalize();
	}

	let tmin, tmax, tymin, tymax, tzmin, tzmax;

	// 计算方向向量的倒数
	const invdirx = 1 / direction.x;
	const invdiry = 1 / direction.y;
	const invdirz = 1 / direction.z;

	// 计算X轴上的交点
	// if (direction.x != 0) {
	// if (invdirx >= 0) {
	if (invdirx >= 0) {
		tmin = (box.min.x - origin.x) * invdirx;
		tmax = (box.max.x - origin.x) * invdirx;
	} else {
		tmin = (box.max.x - origin.x) * invdirx;
		tmax = (box.min.x - origin.x) * invdirx;
	}

	// }

	// 计算Y轴上的交点
	// if (direction.y != 0) {
	// if (invdiry >= 0) {
	if (invdiry >= 0) {
		tymin = (box.min.y - origin.y) * invdiry;
		tymax = (box.max.y - origin.y) * invdiry;
	} else {
		tymin = (box.max.y - origin.y) * invdiry;
		tymax = (box.min.y - origin.y) * invdiry;
	}
	// }

	// 检查是否在X和Y方向上有重叠
	if ((tmin > tymax) || (tymin > tmax)) return null;

	// 更新tmin和tmax
	if (tymin > tmin || tmin !== tmin) tmin = tymin;
	if (tymax < tmax || tmax !== tmax) tmax = tymax;

	// 计算Z轴上的交点
	// if (direction.z != 0) {
	// if (invdirz >= 0) {
	if (invdirz >= 0

	) {
		tzmin = (box.min.z - origin.z) * invdirz;
		tzmax = (box.max.z - origin.z) * invdirz;
	} else {
		tzmin = (box.max.z - origin.z) * invdirz;
		tzmax = (box.min.z - origin.z) * invdirz;
	}
	// }

	// 检查是否在Z方向上有重叠
	if ((tmin > tzmax) || (tzmin > tmax)) return null;

	// 更新tmin和tmax
	if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
	if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

	// 如果tmax < 0，则盒子在射线起点后面，没有交点
	if (tmax < 0) return null;

	// 选择最近的交点
	const t = tmin >= 0 ? tmin : tmax;

	// 计算交点
	const hitPoint = new Vector3(
		origin.x + t * direction.x,
		origin.y + t * direction.y,
		origin.z + t * direction.z
	);

	// 计算碰撞法线（精确匹配Three.js的边界检查）
	const normal = new Vector3();
	const epsilon = 1e-5;

	// 检查哪个面被击中
	if (Math.abs(hitPoint.x - box.min.x) < epsilon) {
		normal.set(-1, 0, 0);
	} else if (Math.abs(hitPoint.x - box.max.x) < epsilon) {
		normal.set(1, 0, 0);
	} else if (Math.abs(hitPoint.y - box.min.y) < epsilon) {
		normal.set(0, -1, 0);
	} else if (Math.abs(hitPoint.y - box.max.y) < epsilon) {
		normal.set(0, 1, 0);
	} else if (Math.abs(hitPoint.z - box.min.z) < epsilon) {
		normal.set(0, 0, -1);
	} else if (Math.abs(hitPoint.z - box.max.z) < epsilon) {
		normal.set(0, 0, 1);
	}

	return { t, normal };
}


// OBB碰撞检测函数
let _rayIntersectOBB = (origin: Vector3, direction: Vector3, obb: OBB): { t: number, normal: Vector3 } | null => {
	// 确保方向是归一化的
	if (Math.abs(direction.lengthSq() - 1) > 1e-5) {
		direction = direction.clone().normalize();
	}

	// 将射线转换到OBB的局部空间
	const localOrigin = origin.clone().sub(obb.center);
	localOrigin.applyMatrix3(_m1.copy(obb.rotation).transpose());

	const localDirection = direction.clone();
	localDirection.applyMatrix3(_m1.copy(obb.rotation).transpose());

	// 在局部空间中计算碰撞
	let tmin = -Infinity;
	let tmax = Infinity;

	// 计算各轴的交点
	for (let i = 0; i < 3; i++) {
		const axis = i === 0 ? 'x' : i === 1 ? 'y' : 'z';
		const originVal = localOrigin[axis];
		const directionVal = localDirection[axis];

		const halfSizeVal = obb.halfSize[axis];

		if (Math.abs(directionVal) < 1e-5) {
			// 方向平行于轴
			if (originVal < -halfSizeVal || originVal > halfSizeVal) {
				return null; // 没有交点
			}
		} else {
			// 计算交点
			const t1 = (-halfSizeVal - originVal) / directionVal;
			const t2 = (halfSizeVal - originVal) / directionVal;

			// 更新tmin和tmax
			tmin = Math.max(tmin, Math.min(t1, t2));
			tmax = Math.min(tmax, Math.max(t1, t2));
		}
	}

	// 检查是否有有效交点
	if (tmin > tmax || tmax < 0) return null;

	// 选择最近的交点
	const t = tmin >= 0 ? tmin : tmax;

	// 计算局部空间中的碰撞点
	const localHitPoint = new Vector3(
		localOrigin.x + t * localDirection.x,
		localOrigin.y + t * localDirection.y,
		localOrigin.z + t * localDirection.z
	);

	// 计算法线（在局部空间中）
	const localNormal = new Vector3();
	const epsilon = 1e-5;

	if (Math.abs(localHitPoint.x + obb.halfSize.x) < epsilon) {
		localNormal.set(-1, 0, 0);
	} else if (Math.abs(localHitPoint.x - obb.halfSize.x) < epsilon) {
		localNormal.set(1, 0, 0);
	} else if (Math.abs(localHitPoint.y + obb.halfSize.y) < epsilon) {
		localNormal.set(0, -1, 0);
	} else if (Math.abs(localHitPoint.y - obb.halfSize.y) < epsilon) {
		localNormal.set(0, 1, 0);
	} else if (Math.abs(localHitPoint.z + obb.halfSize.z) < epsilon) {
		localNormal.set(0, 0, -1);
	} else if (Math.abs(localHitPoint.z - obb.halfSize.z) < epsilon) {
		localNormal.set(0, 0, 1);
	}

	// 将法线转换回世界空间
	const worldNormal = localNormal.clone();
	worldNormal.applyMatrix3(obb.rotation);

	return { t, normal: worldNormal };
}

// let _isEnterBox = (box, oldPosition, newPosition) => {
// 	return box.getCenter(_v1).sub(oldPosition).length() > box.getCenter(_v2).sub(newPosition).length()
// }



let _computeMoveCollisionVelocity = (velocity, oldPoint, collisionBounding, isOBB): Vector3 => {
	// 计算移动距离和方向
	const distance = velocity.length();
	if (distance === 0) {
		return velocity;
	}

	// 归一化方向向量
	const direction = velocity.clone().normalize();

	// 计算射线与碰撞盒的相交
	let hit
	if (isOBB) {
		hit = _rayIntersectOBB(oldPoint, direction, collisionBounding as OBB)
	}
	else {
		hit = _rayIntersectBox(oldPoint, direction, collisionBounding as Box3);
	}

	if (!hit) {
		return velocity;
	}

	// // 计算碰撞点之前的移动
	// let preCollisionMovement = direction.clone().multiplyScalar(hit.t);

	// // 计算碰撞点之后的剩余移动
	// let remainingMovement = velocity.clone().sub(preCollisionMovement);

	// 将剩余速度投影到碰撞平面的切平面上
	let normal = hit.normal;
	// let dot = remainingMovement.dot(normal);
	let dot = velocity.clone().dot(normal);

	// 从速度中移除法线方向的分量
	// let tangentMovement = remainingMovement.clone().sub(
	let tangentMovement = velocity.clone().sub(
		normal.clone().multiplyScalar(dot)
	);

	// 返回碰撞点之前的移动 + 切线方向的移动
	// return preCollisionMovement.add(ttangentMovementangentMovement);
	return tangentMovement
}

// /*! 计算与OBB.toBox3()的碰撞还是有问题（特别是当巨大娘较大时）！
// * 
// */
export let computeMoveCollisionVelocity = (velocity, oldPoint, [collisionBoxes, collisionOBBs]: [Array<Box3>, Array<OBB>]): [Vector3, boolean] => {
	//     TODO update collision corresponding:
	//     refer to:
	// http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
	// https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

	// if (
	//     // isMapWall(collisionName)
	//     // ||
	//     // !isJudgeCollisionBox

	//     // ||
	//     // _isPassThroughBox(newCenter, collisionBox)

	//     // || 
	//     _isEnterBox(collisionBox, oldPoint, newCenter)

	// ) {
	//     // return new Vector3(0, 0, 0)

	//     // 分别检查X和Z方向的碰撞
	//     let testX = new Vector3(velocity.x, 0, 0)
	//     let testZ = new Vector3(0, 0, velocity.z)

	//     // 测试X方向移动
	//     // let testBoxX = oldLittleManBox.clone().translate(testX)

	//     // littleManBox.translate(velocity)
	//     if (!_isEnterBox(collisionBox, oldPoint, oldPoint.clone().add(testX))) {
	//         adjustedVelocity.set(velocity.x, adjustedVelocity.y, 0)
	//     }
	//     // 测试Z方向移动
	//     // let testBoxZ = oldLittleManBox.clone().translate(testZ)
	//     else if (!_isEnterBox(collisionBox, oldPoint, oldPoint.clone().add(testZ))) {
	//         adjustedVelocity.set(0, adjustedVelocity.y, velocity.z)
	//     }
	//     else {
	//         adjustedVelocity.set(0, adjustedVelocity.y, 0)
	//     }
	// }


	velocity = collisionBoxes.reduce((velocity, collisionBox) => {
		return _computeMoveCollisionVelocity(velocity, oldPoint, collisionBox, false)
	}, velocity)
	velocity = collisionOBBs.reduce((velocity, collisionOBB) => {
		return _computeMoveCollisionVelocity(velocity, oldPoint, collisionOBB, true)
	}, velocity)

	return [velocity, collisionBoxes.length > 0 || collisionOBBs.length > 0]
}


export let computeMovableVelocity = (state,
	updateMoveCollisionFunc, name,
	velocity: Vector3, currentPoint, box, stateMachine, isJudgeGirl, isOnlyCollisionWithStatic) => {
	let _func = (factor) => {
		if (factor < 0.25) {
			return new Vector3(0, 0, 0)
		}

		if (factor < 1) {
			velocity = velocity.clone().multiplyScalar(factor)
		}

		let newVelocity = velocity

		if (StateMachine.isState(stateMachine, objectStateName.Climb)) {
			let usedGirl = getNearestUsedGirl(state, currentPoint, name)

			newVelocity = computeClimbMovableVelocity(state, usedGirl, velocity, box)

			if (newVelocity.equals(_v1.set(0, 0, 0))) {
				return _func(factor / 2)
			}
		}
		// else {
		// 	velocity = computeTranslate(state, delta, newForward, newSide, controlRotationAngle)

		// 	velocity.setY(0)

		// 	// littleManCollisionBox = getBox(state)
		// 	// isJudgeGirl = true
		// }


		if (!state.config.isNotMoveCollision) {
			newVelocity = updateMoveCollisionFunc(velocity, state, isJudgeGirl, isOnlyCollisionWithStatic, currentPoint)

			if (newVelocity.equals(_v1.set(0, 0, 0))) {
				return _func(factor / 2)
			}
		}

		return newVelocity
	}

	const factor = 1

	return _func(factor)
}