import * as PF from "pathfinding"
import { Box3, Box3Helper, BoxGeometry, BufferGeometry, Color, Float32BufferAttribute, Group, InstancedMesh, LineBasicMaterial, Matrix4, MeshBasicMaterial, Object3D, Quaternion, Vec2, Vector2, Vector3 } from "three"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { name, pathFind, state } from "../type/StateType"
import { nullable } from "../utils/nullable"
import { requireCheck, test } from "../utils/Contract"
import { List, Map } from "immutable"
import { getIsDebug, getIsNotTestPerf, getPathFindState, setPathFindState } from "../state/State"
import { getEmpty, getExn, return_, isNullable, getWithDefault } from "../utils/NullableUtils"
import { getCurrentScene } from "../scene/Scene"
// import { push } from "../utils/ArrayUtils"
import { ArrayUtils, Console, NullableUtils, NumberUtils, Vector2Utils } from "../Main"
import { removeAndDispose } from "../scene/utils/DisposeUtils"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { isInLine } from "../utils/Vector2Utils"

const _v1_1 = new Vector2()
const _v1_2 = new Vector2()
const _v1_3 = new Vector2()

export type range = {
	min: [number, number],
	max: [number, number],
}

type gridCoordinate = [number, number]

export let getGrid = (state: state, key: string) => {
	return getExn(getPathFindState(state).gridMap.get(key))
}

export let setGrid = (state: state, key: string, grid: PF.Grid) => {
	return setPathFindState(state, {
		...getPathFindState(state),
		gridMap: getPathFindState(state).gridMap.set(key, grid)
	})
}

export let getStep = (state: state) => {
	return getExn(getPathFindState(state).step)
}

export let setStep = (state: state, value) => {
	return setPathFindState(state, {
		...getPathFindState(state),
		step: NullableUtils.return_(value)
	})
}


let _getRange = (grid: PF.Grid) => {
	return (grid as any).range
}

let _getStep = (grid: PF.Grid) => {
	return (grid as any).step
}

let _setRangeAndStep = (grid: PF.Grid, range: range, step: number) => {
	(grid as any).range = range;
	(grid as any).step = step;

	return grid
}

let _computeGridWidth = ({ min, max }: range, step: number) => {
	return Math.ceil((max[0] - min[0]) / step)
}

let _computeGridHeight = ({ min, max }: range, step: number) => {
	return Math.ceil((max[1] - min[1]) / step)
}

export let createGrid = (range: range, step: number) => {
	return _setRangeAndStep(new PF.Grid(
		_computeGridWidth(range, step),
		_computeGridHeight(range, step),
	), range, step)
}

let _convertToGridCoordinate = (worldPosition: Vector2, range: range, step: number, isAllowNotInRange: boolean): nullable<gridCoordinate> => {
	let x = worldPosition.x
	let z = worldPosition.y

	let { min, max } = range

	if (x < min[0] || x > max[0] || z < min[1] || z > max[1]) {
		if (isAllowNotInRange) {
			return NullableUtils.getEmpty()
		}

		Console.warn("not in range")

		if (x < min[0]) {
			x = min[0] + 1
		}
		else if (x > max[0]) {
			x = max[0] - 1
		}

		if (z < min[1]) {
			z = min[1] + 1
		}
		else if (z > max[1]) {
			z = max[1] - 1
		}
	}

	let w = _computeGridWidth(range, step)
	let h = _computeGridHeight(range, step)

	return [
		Math.floor((x - min[0]) / (max[0] - min[0]) * w),
		Math.floor((z - min[1]) / (max[1] - min[1]) * h),
	]
}

let _convertToWorldPosition = (gridCoordinate: gridCoordinate, range: range, step: number, isDebug): Vector2 => {
	let w = _computeGridWidth(range, step)
	let h = _computeGridHeight(range, step)

	requireCheck(() => {
		test(`gridCoordinate:${gridCoordinate} not in range`, () => {
			return (gridCoordinate[0] >= 0 && gridCoordinate[0] <= w)
				&& (gridCoordinate[1] >= 0 && gridCoordinate[1] <= h)
		})
	}, isDebug)

	let { min, max } = range

	return new Vector2(
		min[0] + gridCoordinate[0] / w * (max[0] - min[0]),
		min[1] + gridCoordinate[1] / h * (max[1] - min[1]),
	)
}

let _changeVector3ToVector2 = (value: Vector3) => {
	return new Vector2(value.x, value.z)
}

let _changeVector2ToVector3 = (value: Vector2) => {
	return new Vector3(value.x, 0, value.y)
}

export let setWalkableAt = (grid: PF.Grid, box: Box3, isWalkable: boolean) => {
	let min = box.min
	let max = box.max

	let minGridCoordinate = _convertToGridCoordinate(_changeVector3ToVector2(min), _getRange(grid), _getStep(grid), true)
	let maxGridCoordinate = _convertToGridCoordinate(_changeVector3ToVector2(max), _getRange(grid), _getStep(grid), true)

	if (isNullable(minGridCoordinate) || isNullable(maxGridCoordinate)) {
		return grid
	}

	minGridCoordinate = getExn(minGridCoordinate)
	maxGridCoordinate = getExn(maxGridCoordinate)

	let i = minGridCoordinate[0]
	let j = minGridCoordinate[1]
	while (i <= maxGridCoordinate[0]) {
		while (j <= maxGridCoordinate[1]) {
			grid.setWalkableAt(i, j, isWalkable)

			j += 1
		}

		i += 1
		j = minGridCoordinate[1]
	}

	return grid
}

export let createAStarFinder = () => {
	return new PF.AStarFinder({
		diagonalMovement: PF.DiagonalMovement.Never
	})
}

export let isWalkable = (
	worldPosition: Vector2, grid
) => {
	let range = _getRange(grid)
	let step = _getStep(grid)

	return NullableUtils.getWithDefault(
		NullableUtils.map(c => {
			return grid.isWalkableAt(c[0], c[1])
		}, _convertToGridCoordinate(worldPosition, range, step, false)),
		false
	)
}

let _findNeighborValidGridCoordinate = ([x, y]: gridCoordinate, grid: PF.Grid): nullable<gridCoordinate> => {
	let node = grid.getNodeAt(x, y)

	return NullableUtils.bind(node => {
		// let data = grid.getNeighbors(node, PF.DiagonalMovement.Never)
		let data = (grid as any).fastGetNeighbors(node)

		// .find(node => {
		// 	return grid.isWalkableAt(node.x, node.y)
		// })

		let result: nullable<PF.Node> = data.length == 0 ? NullableUtils.getEmpty() : NullableUtils.return_(data[0])

		return NullableUtils.map(result => {
			return [result.x, result.y]
		}, result)
	}, node)
}

let _findNeighborRandomGridCoordinate = ([x, y]: gridCoordinate, grid: PF.Grid): gridCoordinate => {
	let node = grid.getNodeAt(x, y)

	return NullableUtils.bind(node => {
		let data = (grid as any).getAllNeighbors(node)

		if (data.length == 0) {
			throw new Error("error")
		}

		let result: PF.Node = NumberUtils.randomSelect(data)

		return [result.x, result.y]
	}, node)
}

let _makePathValid = (path: Array<Vector2>) => {
	if (path.length >= 2 && path[0].equals(path[path.length - 1])) {
		return []
	}

	return path
}

let _findNearstPath = (finder,
	startGridCoordinate, endGridCoordinate, grid, rangeSquared,
	repeatCount
) => {
	let path = (finder as any).findNearstPath(startGridCoordinate[0], startGridCoordinate[1], endGridCoordinate[0], endGridCoordinate[1], grid.clone(), rangeSquared)

	if (path.length == 0 && repeatCount > 0) {
		return _findNearstPath(finder,
			startGridCoordinate, endGridCoordinate, grid, rangeSquared * 2,
			repeatCount - 1
		)
	}
	else if (path.length == 0) {
		Console.warn(`can't find path with ${rangeSquared}`);
	}

	return path
}

// let _addStartWorldPosition = (path, startWorldPosition, range, step, isDebug) => {
// 	if (path.length > 0 && !_convertToWorldPosition(path[0], range, step, isDebug).equals(startWorldPosition)) {
// 		path = [startWorldPosition.clone()].concat(path)
// 	}

// 	return path
// }

let _handleStartGridCoordinate = (gridCoordinate, grid, name) => {
	if (!grid.isWalkableAt(gridCoordinate[0], gridCoordinate[1])) {
		gridCoordinate = _findNeighborRandomGridCoordinate(gridCoordinate, grid)

		Console.warn(`name: ${name}, gridCoordinate:${gridCoordinate} random find`);
	}

	return gridCoordinate
}

let _handleEndGridCoordinate = (gridCoordinate, grid, name) => {
	if (!grid.isWalkableAt(gridCoordinate[0], gridCoordinate[1])) {
		gridCoordinate = _findNeighborValidGridCoordinate(gridCoordinate, grid)

		if (NullableUtils.isNullable(gridCoordinate)) {
			Console.warn(`name: ${name}, gridCoordinate:${gridCoordinate} not walkable`);

			return NullableUtils.getEmpty()
		}
	}

	return gridCoordinate
}

// let _isEqual = (gridCoordinate1: gridCoordinate, gridCoordinate2: gridCoordinate) => {
// 	return gridCoordinate1[0] == gridCoordinate2[0] && gridCoordinate1[1] == gridCoordinate2[1]
// }

// let _insertStartGridCoordinate = (path: Array<gridCoordinate>, startGridCoordinate: gridCoordinate) => {
// 	// if (handledPath.length > 0 && !handledPath[0].equals(startWorldPosition)) {
// 	// 	// return [state, [startWorldPosition.clone()].concat(handledPath)]

// 	// 	handledPath = [startWorldPosition.clone()].concat(handledPath)
// 	// }

// 	// return handledPath
// 	let result
// 	// if (path.length > 0) {
// 	// 	result = path.reduce((result, gridCoordinate) => {
// 	// 		// if (!isNearlyEqual(point, startWorldPosition, 0.1)) {
// 	// 		// if (!isNearlyEqual(point, startWorldPosition, 1)) {
// 	// 		if (!_isEqual(gridCoordinate, startGridCoordinate)) {
// 	// 			return ArrayUtils.push(result, gridCoordinate)
// 	// 		}

// 	// 		return []
// 	// 	}, [])


// 	// 	// result = [startWorldPosition.clone()].concat(result)
// 	// 	result = path.unshift(startGridCoordinate)
// 	// }
// 	// else {
// 	// 	result = path
// 	// }
// 	result = path.reduce((result, gridCoordinate) => {
// 		if (_isEqual(gridCoordinate, startGridCoordinate)) {
// 			return []
// 		}

// 		return ArrayUtils.push(result, gridCoordinate)
// 	}, [])

// 	// result = path.unshift(startGridCoordinate)
// 	result = [startGridCoordinate].concat(result)

// 	return result
// }

let _insertStartWorldPosition = (handledPath: Array<Vector2>, startWorldPosition: Vector2) => {
	if (handledPath.length >= 2) {
		if (isInLine(startWorldPosition, handledPath[0], handledPath[1])) {
			handledPath[0] = startWorldPosition.clone()
		}
		else {
			handledPath = [startWorldPosition.clone()].concat(handledPath)
		}
	}

	return handledPath
}

export let findPath = (state: state, finder: PF.Finder, startWorldPosition, endWorldPosition,
	isVeryNearAttackTarget: boolean,
	grid: PF.Grid, name: name, isDebug, minInterval: nullable<number>,
	// isFindNearstPath: boolean
	rangeSquared: nullable<number>
): [state, Array<Vector2>] => {
	let range = _getRange(grid)
	let step = _getStep(grid)

	let startGridCoordinate = _convertToGridCoordinate(startWorldPosition, range, step, false)
	let endGridCoordinate = _convertToGridCoordinate(endWorldPosition, range, step, false)

	// if (isDebug) {
	// 	if (isNullable(startGridCoordinate)) {
	// 		throw new Error("error")
	// 	}
	// }

	// if (isNullable(endGridCoordinate)) {
	// 	return [state, []]
	// }

	startGridCoordinate = getExn(startGridCoordinate)
	endGridCoordinate = getExn(endGridCoordinate)


	// if (!grid.isWalkableAt(startGridCoordinate[0], startGridCoordinate[1])) {
	// 	startGridCoordinate = _findNeighborValidGridCoordinate(startGridCoordinate, grid)

	// 	if (NullableUtils.isNullable(startGridCoordinate)) {
	// 		Console.warn(`name: ${name}, startGridCoordinate:${startGridCoordinate} not walkable`);

	// 		return [state, []]
	// 	}

	// 	startGridCoordinate = NullableUtils.getExn(startGridCoordinate)
	// }
	startGridCoordinate = _handleStartGridCoordinate(startGridCoordinate, grid, name)

	// if (NullableUtils.isNullable(startGridCoordinate)) {
	// 	return [state, []]
	// }
	// else {
	// 	startGridCoordinate = NullableUtils.getExn(startGridCoordinate)
	// }


	// if (!grid.isWalkableAt(endGridCoordinate[0], endGridCoordinate[1])
	// 	&& isNullable(rangeSquared)
	// ) {
	// 	Console.warn(`name: ${name}, endGridCoordinate:${endGridCoordinate} not walkable`);

	// 	return [state, []]
	// }
	endGridCoordinate = _handleEndGridCoordinate(endGridCoordinate, grid, name)

	if (NullableUtils.isNullable(endGridCoordinate)) {
		return [state, []]
	}
	else {
		endGridCoordinate = NullableUtils.getExn(endGridCoordinate)
	}




	if (!isNullable(minInterval)) {
		minInterval = getExn(minInterval)

		let now = performance.now()
		let lastFindPathTime = getWithDefault(
			getPathFindState(state).lastFindPathTimeMap.get(name),
			0
		)

		if (now - lastFindPathTime < minInterval) {
			return [state, []]
		}
	}

	let path, handledPath
	if (!isNullable(rangeSquared)) {
		// TODO handle isVeryNearAttackTarget
		path = _findNearstPath(finder,
			startGridCoordinate, endGridCoordinate, grid, NullableUtils.getExn(rangeSquared),
			3
		)

		// path = _addStartWorldPosition(path, startWorldPosition, range, step, isDebug)


		if (path.length == 0) {
			return [state, []]
		}

		handledPath = PF.Util.smoothenPath(grid, path)

	}
	else {
		if (isVeryNearAttackTarget) {
			path = (finder as any).findDirectPath(startGridCoordinate[0], startGridCoordinate[1], endGridCoordinate[0], endGridCoordinate[1], grid)

			if (path.length == 0) {
				path = finder.findPath(startGridCoordinate[0], startGridCoordinate[1], endGridCoordinate[0], endGridCoordinate[1], grid.clone())
			}

			if (path.length == 0) {
				return [state, []]
			}

			handledPath = path
		}
		else {
			path = finder.findPath(startGridCoordinate[0], startGridCoordinate[1], endGridCoordinate[0], endGridCoordinate[1], grid.clone())

			if (path.length == 0) {
				return [state, []]
			}

			handledPath = PF.Util.smoothenPath(grid, path)
		}
	}

	// if (path.length == 0) {
	// 	return [state, []]
	// }

	// // path = _insertStartGridCoordinate(path, startGridCoordinate)
	// handledPath = PF.Util.smoothenPath(grid, path)

	handledPath = handledPath.map((gridCoordinate: gridCoordinate) => {
		return _convertToWorldPosition(gridCoordinate, range, step, isDebug)
	})

	handledPath = _insertStartWorldPosition(handledPath, startWorldPosition)


	handledPath = _makePathValid(handledPath)

	state = setPathFindState(state, {
		...getPathFindState(state),
		lastFindPathTimeMap: getPathFindState(state).lastFindPathTimeMap.set(name, performance.now())
	})


	return [state, handledPath]
}

export let createState = (): pathFind => {
	return {
		gridMap: Map(),
		step: NullableUtils.getEmpty(),
		// findedPaths: List()
		lastFindPathTimeMap: Map()
	}
}

let _buildGroupName = () => "pathFind_group"

// export let showGrid = (state: state) => {
// 	let group = getPathFindState(state).gridMap.reduce((group, grid) => {
// 		Console.log(grid)

// 		let step = _getStep(grid)

// 		let material = new MeshBasicMaterial()

// 		let geometry = new BoxGeometry(1, 1, 1)

// 		let mesh = new InstancedMesh(geometry, material, grid.width * grid.height)
// 		mesh.frustumCulled = false

// 		group.add(mesh)


// 		let i = 0
// 		let j = 0
// 		while (i <= grid.width) {
// 			while (j <= grid.height) {
// 				let center = _changeVector2ToVector3(_convertToWorldPosition([i, j], _getRange(grid), step, true))
// 				// let scale = new Vector3(step, step, step)
// 				let scale = new Vector3(1, 1, 1)

// 				// let meshIndex = i * grid.width + j
// 				let meshIndex = i * grid.height + j


// 				mesh.setMatrixAt(meshIndex, new Matrix4().compose(
// 					center, new Quaternion(), scale
// 				))

// 				if (grid.isWalkableAt(i, j)) {
// 					mesh.setColorAt(meshIndex, new Color(0x008000))
// 				}
// 				else {
// 					mesh.setColorAt(meshIndex, new Color(0xff0000))
// 				}

// 				j += 1
// 			}

// 			i += 1
// 			j = 0
// 		}

// 		return group
// 	}, new Group())

// 	let groupName = _buildGroupName()

// 	group.name = groupName

// 	let scene = getCurrentScene(state)

// 	// let previousGroup = null
// 	// scene.traverse(obj => {
// 	// 	if (obj.name == groupName) {
// 	// 		previousGroup = obj
// 	// 	}
// 	// })
// 	// if (previousGroup !== null) {
// 	// 	scene.remove(previousGroup)
// 	// }

// 	state = hideGrid(state)

// 	scene.add(group)

// 	return state
// }

export let showGrid = (state: state, grid) => {
	let group = new Group()

	let step = _getStep(grid)

	let material = new MeshBasicMaterial()

	let geometry = new BoxGeometry(1, 1, 1)

	let mesh = new InstancedMesh(geometry, material, grid.width * grid.height)
	mesh.frustumCulled = false

	group.add(mesh)


	let i = 0
	let j = 0
	while (i <= grid.width) {
		while (j <= grid.height) {
			let center = _changeVector2ToVector3(_convertToWorldPosition([i, j], _getRange(grid), step, true))
			// let scale = new Vector3(step, step, step)
			let scale = new Vector3(1, 1, 1)

			// let meshIndex = i * grid.width + j
			let meshIndex = i * grid.height + j


			mesh.setMatrixAt(meshIndex, new Matrix4().compose(
				center, new Quaternion(), scale
			))

			if (grid.isWalkableAt(i, j)) {
				mesh.setColorAt(meshIndex, new Color(0x008000))
			}
			else {
				mesh.setColorAt(meshIndex, new Color(0xff0000))
			}

			j += 1
		}

		i += 1
		j = 0
	}


	let groupName = _buildGroupName()

	group.name = groupName

	let scene = getCurrentScene(state)

	// let previousGroup = null
	// scene.traverse(obj => {
	// 	if (obj.name == groupName) {
	// 		previousGroup = obj
	// 	}
	// })
	// if (previousGroup !== null) {
	// 	scene.remove(previousGroup)
	// }

	state = hideGrid(state)

	scene.add(group)

	return state
}

export let hideGrid = (state: state) => {
	let scene = getCurrentScene(state)

	let previousGroup = null
	scene.traverse(obj => {
		if (obj.name == _buildGroupName()) {
			previousGroup = obj
		}
	})
	if (previousGroup !== null) {
		removeAndDispose(scene, previousGroup)
	}

	return state
}

export let showFindedPath = (state: state, findedPath: Array<Vector2>, colorHex, linewidth = 0.001) => {
	// return setPathFindState(state, {
	// 	...getPathFindState(state),
	// 	findedPaths: List<any>().setSize(count)
	// })

	const material = new LineMaterial()

	material.color = new Color(
		colorHex
	)
	material.linewidth = linewidth

	// const geometry = new BufferGeometry();
	// let positions = findedPath.reduce((positions, worldPosition) => {
	// 	positions.push(worldPosition.x, 0, worldPosition.y)

	// 	return positions
	// }, [])

	// geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

	const geometry = new LineGeometry()
	let positions = findedPath.reduce((positions, worldPosition) => {
		positions.push(worldPosition.x, 0, worldPosition.y)

		return positions
	}, [])

	// geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
	geometry.setPositions(positions)


	// geometry.computeBoundingSphere();

	let line = new Line2(geometry, material);
	// let name = "path_line"
	// line.name = name

	// let oldLines = []
	// getCurrentScene(state).traverse(obj => {
	// 	if (obj.name == name) {
	// 		oldLines.push(obj)
	// 	}
	// })
	// oldLines.forEach(oldLine => {
	// 	removeAndDispose(getCurrentScene(state), oldLine)
	// })



	getCurrentScene(state).add(line)

	// return state
}

export let disposeData = (state: state, name: name) => {
	return setPathFindState(state, {
		...getPathFindState(state),
		lastFindPathTimeMap: getPathFindState(state).lastFindPathTimeMap.remove(name),
	})
}

export let dispose = (state: state) => {
	return setPathFindState(state, createState())
}

export let findValidPosition = (worldPosition: Vector2, grid: PF.Grid, isDebug): nullable<Vector3> => {
	let range = _getRange(grid)
	let step = _getStep(grid)

	return NullableUtils.map(result => {
		// TODO fix position y
		return new Vector3(result.x, 0, result.y)
	}, NullableUtils.bind(gridCoordinate => {
		if (grid.isWalkableAt(gridCoordinate[0], gridCoordinate[1])) {
			return NullableUtils.return_(worldPosition)
		}

		return NullableUtils.bind(c => {
			return _convertToWorldPosition(c, range, step, isDebug)
		}, _findNeighborValidGridCoordinate(gridCoordinate, grid)
		)
	}, _convertToGridCoordinate(worldPosition, range, step, false)))


	// let result = NullableUtils.getWithDefault(
	// 	NullableUtils.bind(gridCoordinate => {
	// 		if (grid.isWalkableAt(gridCoordinate[0], gridCoordinate[1])) {
	// 			return NullableUtils.return_(worldPosition)
	// 		}

	// 		return NullableUtils.bind(c => {
	// 			return _convertToWorldPosition(c, range, step, isDebug)
	// 		}, _findNeighborValidGridCoordinate(gridCoordinate, grid)
	// 		)
	// 	}, _convertToGridCoordinate(worldPosition, range, step)),
	// 	worldPosition
	// )

	// return new Vector3(result.x, 0, result.y)
}