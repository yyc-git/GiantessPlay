import { getIsDebug, getParticleState, setParticleState } from "../state/State"
import { id, loopCount, particle, protectEmitterParam, state } from "../type/StateType"
import { getEmpty, getExn, getWithDefault, isNullable, return_ } from "../utils/NullableUtils"
import * as DustEmitter from "./DustEmitter"
import * as StompDustEmitter from "./StompDustEmitter"
import * as FlameEmitter from "./FlameEmitter"
import * as BulletEmitter from "./BulletEmitter"
import * as PropBulletEmitter from "./PropBulletEmitter"
import * as ShellEmitter from "./ShellEmitter"
import * as ShellEmitOrExplodeEmitter from "./ShellEmitOrExplodeEmitter"
import * as BulletHitEmitter from "./BulletHitEmitter"
import * as PropBulletHitEmitter from "./PropBulletHitEmitter"
import * as WaterBloomEmitter from "./WaterBloomEmitter"
import * as MilkSplashEmitter from "./MilkSplashEmitter"
import * as ClothDestroyedEmitter from "./ClothDestroyedEmitter"
import * as BlinkEmitter from "./BlinkEmitter"
import * as SwipingHitEmitter from "./SwipingHitEmitter"
import * as ProtectEmiiter from "./ProtectEmiiter"
import * as RocketEmitter from "./instance/RocketEmitter"
import * as MissileVehicleMissileEmitter from "./instance/MissileVehicleMissileEmitter"
import * as LaserBulletEmitter from "./LaserBulletEmitter"
import * as LaserBulletHitEmitter from "./LaserBulletHitEmitter"
import { ArrayUtils, MutableMapUtils, MutableNumberMapUtils } from "../Main"
import { requireCheck, test } from "../utils/Contract"

export let createState = (): particle => {
	return {
		maxId: 0,
		reallocateIds: ArrayUtils.create(),
		allEmitParticlesForCollisionCheck: ArrayUtils.create(),

		needCollisionCheckLoopCountMap: MutableNumberMapUtils.create(),

		dustEmitter: getEmpty(),
		stompDustEmitter: getEmpty(),
		flameEmitter: getEmpty(),
		bulletEmitter: getEmpty(),
		propBulletEmitter: getEmpty(),
		shellEmitter: getEmpty(),
		shellEmitOrExplodeEmitter: getEmpty(),
		bulletHitEmitter: getEmpty(),
		propBulletHitEmitter: getEmpty(),
		waterBloomEmitter: getEmpty(),
		milkSplashEmitter: getEmpty(),
		clothDestroyedEmitter: getEmpty(),
		blinkEmitter: getEmpty(),
		swipingHitEmitter: getEmpty(),
		protectEmitter: getEmpty(),
		rocketEmitter: getEmpty(),
		missileVehicleMissileEmitter: getEmpty(),
		laserBulletEmitter: getEmpty(),
		laserBulletHitEmitter: getEmpty(),
	}
}

// export let init = (state: state) => {

// }

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]): Promise<specificState> => {
	let state = getAbstractStateFunc(specificState)

	let { dustEmitter, stompDustEmitter, flameEmitter, bulletEmitter, shellEmitter, shellEmitOrExplodeEmitter, bulletHitEmitter, waterBloomEmitter, milkSplashEmitter, clothDestroyedEmitter, blinkEmitter, swipingHitEmitter, protectEmitter,
		propBulletEmitter, propBulletHitEmitter,
		rocketEmitter,
		missileVehicleMissileEmitter,
		laserBulletEmitter,
		laserBulletHitEmitter,
	} = getParticleState(state)

	if (!isNullable(dustEmitter)) {
		state = DustEmitter.update(state)
	}
	if (!isNullable(stompDustEmitter)) {
		state = StompDustEmitter.update(state)
	}
	if (!isNullable(flameEmitter)) {
		state = FlameEmitter.update(state)
	}
	if (!isNullable(bulletEmitter)) {
		state = BulletEmitter.update(state)
	}
	if (!isNullable(shellEmitter)) {
		state = ShellEmitter.update(state)
	}
	if (!isNullable(shellEmitOrExplodeEmitter)) {
		state = ShellEmitOrExplodeEmitter.update(state)
	}
	if (!isNullable(bulletHitEmitter)) {
		state = BulletHitEmitter.update(state)
	}
	if (!isNullable(waterBloomEmitter)) {
		state = WaterBloomEmitter.update(state)
	}
	if (!isNullable(milkSplashEmitter)) {
		state = MilkSplashEmitter.update(state)
	}
	if (!isNullable(clothDestroyedEmitter)) {
		state = ClothDestroyedEmitter.update(state)
	}
	if (!isNullable(blinkEmitter)) {
		state = BlinkEmitter.update(state)
	}
	if (!isNullable(swipingHitEmitter)) {
		state = SwipingHitEmitter.update(state)
	}
	if (!isNullable(protectEmitter)) {
		specificState = ProtectEmiiter.update(specificState, [getAbstractStateFunc, setAbstractStateFunc])
	}
	if (!isNullable(propBulletEmitter)) {
		state = PropBulletEmitter.update(state)
	}
	if (!isNullable(propBulletHitEmitter)) {
		state = PropBulletHitEmitter.update(state)
	}
	if (!isNullable(rocketEmitter)) {
		state = RocketEmitter.update(state)
	}
	if (!isNullable(missileVehicleMissileEmitter)) {
		state = MissileVehicleMissileEmitter.update(state)
	}
	if (!isNullable(laserBulletEmitter)) {
		state = LaserBulletEmitter.update(state)
	}
	if (!isNullable(laserBulletHitEmitter)) {
		state = LaserBulletHitEmitter.update(state)
	}



	let needCollisionCheckLoopCountMap = MutableNumberMapUtils.map(getParticleState(state).needCollisionCheckLoopCountMap, (loopCount) => loopCount - 1)

	// let needRemoveIndices = needCollisionCheckLoopCountMap.reduce((result, loopCount, i) => {
	// 	if (loopCount < 0) {
	// 		return ArrayUtils.push(result, i)
	// 	}

	// 	return result
	// }, [])

	// needCollisionCheckLoopCountMap = MutableNumberMapUtils.removeMutiples(needCollisionCheckLoopCountMap, needRemoveIndices)

	getParticleState(state).needCollisionCheckLoopCountMap = needCollisionCheckLoopCountMap


	specificState = setAbstractStateFunc(specificState, state)

	return Promise.resolve(specificState)
}

export let enableDust = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		dustEmitter: return_(DustEmitter.createState())
	})

	return DustEmitter.init(state, scene)
}

export let enableStompDust = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		stompDustEmitter: return_(StompDustEmitter.createState())
	})

	return StompDustEmitter.init(state, scene)
}

export let enableFlame = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		flameEmitter: return_(FlameEmitter.createState())
	})

	return FlameEmitter.init(state, scene)
}

export let enableBullet = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		bulletEmitter: return_(BulletEmitter.createState())
	})

	return BulletEmitter.init(state, scene)
}

export let enableRocket = (state: state, scene, rocket) => {
	state = setParticleState(state, {
		...getParticleState(state),
		rocketEmitter: return_(RocketEmitter.createState())
	})

	return RocketEmitter.init(state, scene, rocket)
}

export let enableMissileVehicleMissile = (state: state, scene, missile) => {
	state = setParticleState(state, {
		...getParticleState(state),
		missileVehicleMissileEmitter: return_(MissileVehicleMissileEmitter.createState())
	})

	return MissileVehicleMissileEmitter.init(state, scene, missile)
}

export let enableLaserBullet = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		laserBulletEmitter: return_(LaserBulletEmitter.createState())
	})

	return LaserBulletEmitter.init(state, scene)
}

export let enableLaserBulletHit = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		laserBulletHitEmitter: return_(LaserBulletHitEmitter.createState())
	})

	return LaserBulletHitEmitter.init(state, scene)
}

export let enableShell = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		shellEmitter: return_(ShellEmitter.createState())
	})

	return ShellEmitter.init(state, scene)
}

export let enableShellEmitOrExplode = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		shellEmitOrExplodeEmitter: return_(ShellEmitOrExplodeEmitter.createState())
	})

	return ShellEmitOrExplodeEmitter.init(state, scene)
}

export let enableBulletHit = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		bulletHitEmitter: return_(BulletHitEmitter.createState())
	})

	return BulletHitEmitter.init(state, scene)
}

export let enableWaterBloom = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		waterBloomEmitter: return_(WaterBloomEmitter.createState())
	})

	return WaterBloomEmitter.init(state, scene)
}

export let enableMilkSplash = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		milkSplashEmitter: return_(MilkSplashEmitter.createState())
	})

	return MilkSplashEmitter.init(state, scene)
}

export let enableClothDestroyed = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		clothDestroyedEmitter: return_(ClothDestroyedEmitter.createState())
	})

	return ClothDestroyedEmitter.init(state, scene)
}

export let enableBlink = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		blinkEmitter: return_(BlinkEmitter.createState())
	})

	return BlinkEmitter.init(state, scene)
}

export let enableSwipingHit = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		swipingHitEmitter: return_(SwipingHitEmitter.createState())
	})

	return SwipingHitEmitter.init(state, scene)
}

export let enableProtect = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		protectEmitter: return_(ProtectEmiiter.createState())
	})

	return ProtectEmiiter.init(state, scene)
}

export let enablePropBullet = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		propBulletEmitter: return_(PropBulletEmitter.createState())
	})

	return PropBulletEmitter.init(state, scene)
}

export let enablePropBulletHit = (state: state, scene) => {
	state = setParticleState(state, {
		...getParticleState(state),
		propBulletHitEmitter: return_(PropBulletHitEmitter.createState())
	})

	return PropBulletHitEmitter.init(state, scene)
}

export let emitDust = (state: state, param) => {
	state = DustEmitter.emit(state, param)

	return state
}

export let emitStompDust = (state: state, param) => {
	state = StompDustEmitter.emit(state, param)

	return state
}

export let emitFlame = (state: state, param) => {
	state = FlameEmitter.emit(state, param)

	return state
}

export let emitBullet = (state: state, param, needCollisionCheckLoopCount) => {
	state = BulletEmitter.emit(state, param)

	let emittedParticle = getExn(BulletEmitter.getAllParticles(state)[BulletEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitRocket = (state: state, param, needCollisionCheckLoopCount) => {
	state = RocketEmitter.emit(state, param)

	let emittedParticle = getExn(RocketEmitter.getAllParticles(state)[RocketEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitMissileVehicleMissile = (state: state, param, needCollisionCheckLoopCount) => {
	state = MissileVehicleMissileEmitter.emit(state, param)

	let emittedParticle = getExn(MissileVehicleMissileEmitter.getAllParticles(state)[MissileVehicleMissileEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitLaserBullet = (state: state, param, needCollisionCheckLoopCount) => {
	state = LaserBulletEmitter.emit(state, param)

	let emittedParticle = getExn(LaserBulletEmitter.getAllParticles(state)[LaserBulletEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitShell = (state: state, param, needCollisionCheckLoopCount: loopCount) => {
	state = ShellEmitter.emit(state, param)

	let emittedParticle = getExn(ShellEmitter.getAllParticles(state)[ShellEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitShellEmitOrExplode = (state: state, param) => {
	state = ShellEmitOrExplodeEmitter.emit(state, param)

	return state
}

export let emitBulletHit = (state: state, param) => {
	state = BulletHitEmitter.emit(state, param)

	return state
}

export let emitLaserBulletHit = (state: state, param) => {
	state = LaserBulletHitEmitter.emit(state, param)

	return state
}

export let emitWaterBloom = (state: state, param) => {
	state = WaterBloomEmitter.emit(state, param)

	return state
}

export let emitMilkSplash = (state: state, param) => {
	state = MilkSplashEmitter.emit(state, param)

	return state
}

export let emitClothDestroyed = (state: state, param) => {
	state = ClothDestroyedEmitter.emit(state, param)

	return state
}

export let emitBlink = (state: state, param) => {
	state = BlinkEmitter.emit(state, param)

	return state
}


export let emitSwipingHit = (state: state, param) => {
	state = SwipingHitEmitter.emit(state, param)

	return state
}

export let emitProtect = (state: state, param) => {
	state = ProtectEmiiter.emit(state, param)

	return state
}

export let emitPropBullet = (state: state, param, needCollisionCheckLoopCount) => {
	state = PropBulletEmitter.emit(state, param)

	let emittedParticle = getExn(PropBulletEmitter.getAllParticles(state)[PropBulletEmitter.getAllParticles(state).length - 1])

	state = setNeedCollisionCheckLoopCount(state, emittedParticle.id, needCollisionCheckLoopCount)

	return state
}

export let emitPropBulletHit = (state: state, param) => {
	state = PropBulletHitEmitter.emit(state, param)

	return state
}

export let dispose = (state: state) => {
	return setParticleState(state, createState())
}

let _getAllEmitParticlesForCollisionCheck = (state: state, allParticles) => {
	// return allParticles.filter(particle => {
	// 	requireCheck(() => {
	// 		test("loopCount should >= 0", () => {
	// 			return MutableNumberMapUtils.getExn(getParticleState(state).needCollisionCheckLoopCountMap, particle.id) >= 0
	// 		})
	// 	}, getIsDebug(state))

	// 	return MutableNumberMapUtils.getExn(getParticleState(state).needCollisionCheckLoopCountMap, particle.id) == 0
	// })

	return allParticles.reduce(([index, allEmitParticlesForCollisionCheck], particle) => {
		requireCheck(() => {
			test("loopCount should >= 0", () => {
				return MutableNumberMapUtils.getExn(getParticleState(state).needCollisionCheckLoopCountMap, particle.id) >= 0
			})
		}, getIsDebug(state))

		if (MutableNumberMapUtils.getExn(getParticleState(state).needCollisionCheckLoopCountMap, particle.id) == 0) {
			return [
				index + 1,
				ArrayUtils.set(allEmitParticlesForCollisionCheck, index, particle)
			]
		}

		return [index, allEmitParticlesForCollisionCheck]
	}, [0, getParticleState(state).allEmitParticlesForCollisionCheck])
}

export let getAllBulletParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, BulletEmitter.getAllParticles(state))
}

export let getAllPropBulletParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, PropBulletEmitter.getAllParticles(state))
}

export let getAllRocketParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, RocketEmitter.getAllParticles(state))
}

export let getAllMissileVehicleMissileParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, MissileVehicleMissileEmitter.getAllParticles(state))
}

export let getAllLaserBulletParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, LaserBulletEmitter.getAllParticles(state))
}

export let getAllShellParticlesForCollisionCheck = (state: state) => {
	return _getAllEmitParticlesForCollisionCheck(state, ShellEmitter.getAllParticles(state))
}

export let markParticleRemove = (particle) => {
	particle.life = 0
}

export let setNeedCollisionCheckLoopCount = (state: state, id: id, loopCount: loopCount) => {
	MutableNumberMapUtils.set(getParticleState(state).needCollisionCheckLoopCountMap, id, loopCount)

	return state
}