import { api, box3, matrix4 } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getBulletHitSoundResourceId, getWeaponValue } from "../json/Data";
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType";
import { service as particleService } from "particle-protocol/src/service/ServiceType"
import { service as particleShareService } from "particle-share-protocol/src/service/ServiceType"
import { getEliteGiantessShareBlockName, getEliteGiantessShareProtocolName, getParticleBulletEmitBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName } from "./Utils";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";
import { isEliteGiantess } from "frontend/src/scene3d_layer/mod/EliteGiantessMod";

let _emitBulletHit = (api: api, state: state, position: [number, number, number]) => {
    let { emitterVolume } = getWeaponValue(api, state)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getBulletHitSoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    ))

    // return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
    //     [
    //         api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletHitBlockName()),
    //         state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletHitBlockName()),
    //         (state, blockState) => {
    //             return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBulletHitBlockName(), blockState)
    //         }
    //     ],
    //     api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletHitBlockName()).getParticleType(),
    //     {
    //         speed: 1,
    //         life: 500,
    //         size: 3,
    //         position: position
    //     })
    return api.setAbstractState(state, api.ParticleManager.emitPropBulletHit(api.getAbstractState(state), {
        speed: 1,
        life: 500,
        size: 2,
        position: position
    }))
}

export let handleBulletHitGirl = (api: api) => (state: state, handleFunc, usedGirl, position) => {
    state = _emitBulletHit(api, state, position)

    return handleFunc(state).then(api.TupleUtils.getTuple2First).then(state => {
        // return api.triggerGirlAction(state,  usedGirl, actionName.Bigger).then(api.TupleUtils.getTuple2First)
        // return api.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, api.buildFuncData(), (state, initialScale, girlValue) => {
        //     // return api.NumberUtils.lessThan(initialScale + 10, getMaxScale(state, girlValue))
        //     return api.NumberUtils.lessThan(initialScale + Math.round(api.NumberUtils.greaterThan(
        //         initialScale * 0.1, 10
        //     )), getMaxScale(state, girlValue))
        // }, usedGirl, api.setGirlScale)


        state = api.GiantessBuildUtils.setScaleIncrease(state, api.buildFuncData(), (state, scaleIncrease, girlValue) => {
            // return scaleIncrease * 1.1
            return scaleIncrease + Math.round(api.NumberUtils.greaterThan(
                scaleIncrease * 0.1, 10
            ))
        }, usedGirl)

        // return api.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, api.buildFuncData(), (state, initialScale, girlValue) => {
        //     return api.NumberUtils.lessThan(initialScale * 1.1, getMaxScale(state, girlValue))
        // }, usedGirl, api.setGirlScale)

        // return api.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, api.buildFuncData(), (state, initialScale, girlValue) => {
        //     return api.NumberUtils.lessThan(initialScale + Math.round(api.NumberUtils.greaterThan(
        //         initialScale * 0.1, 10
        //     )), api.getMaxScale(state, girlValue))
        // }, usedGirl, api.setGirlScale)
        return api.setGirlScaleAndKeepCamera(state,usedGirl,
            api.NumberUtils.lessThan(
                api.getGirlScale(state, usedGirl) + api.NumberUtils.greaterThan(
                    api.getGirlScale(state, usedGirl) * 0.1, 10
                ),
                api.getMaxScale(state, api.getGirlValue(state, usedGirl)))
        )
    })
}

// export let handleBulletHitGirl = handleBulletHitStatic


let _handleBulletHitEliteGiantess = (api: api) => (state: state, handleFunc, position,
    pointBox,
    particleDirection,
    data: Array<[matrix4, box3, name]>
) => {
    state = _emitBulletHit(api, state, position)

    return handleFunc(state).then(api.TupleUtils.getTuple2First).then(state => {
        data.forEach(([matrix, box, name]) => {
            // if (!api.blockAPI.getBlockService<service>(state, getEliteGiantessShareProtocolName(), getEliteGiantessShareBlockName()).isEliteGiantess(name)) {
            if (!isEliteGiantess(state, name)) {
                return
            }


            let data = api.scaleEliteGiantess(api, state, sizeY => {
                let factor
                if (sizeY < 30) {
                    factor = 2
                }
                else if (sizeY < 100) {
                    factor = 1.5
                }
                else {
                    factor = 1.1
                }

                return sizeY * factor
            }, [matrix, box], name)
            state = data[0]

            // let size = api.box3.getSize(box, api.vector3.getTempVector1())

            // if (api.isEliteGiantessMaxHeight(size.y)) {
            //     return
            // }


            // let factor
            // if (size.y < 30) {
            //     factor = 2
            // }
            // else if (size.y < 100) {
            //     factor = 1.5
            // }
            // else {
            //     factor = 1.1
            // }


            // let offsetY = size.y * (factor - 1) * 0.5
            // size = api.vector3.multiplyScalar(size, factor)

            // let center = api.box3.getCenter(box, api.vector3.getTempVector2())

            // let _ = api.box3.copy(
            //     box,
            //     api.box3.setFromCenterAndSize(
            //         api.box3.getTempBox1(),
            //         api.vector3.setY(
            //             center,
            //             center.y + offsetY
            //         ),
            //         size
            //     )
            // )

            // let scale = api.matrix4.getScaleFromMatrix4(matrix)
            // scale = api.vector3.multiplyScalar(scale, factor)
            // let _matrix = api.matrix4.setScaleToMatrix4(matrix, scale)
        })

        return state
    })
}

export let handleBulletHitArmy = (api: api) => api.handleHitArmy(_handleBulletHitEliteGiantess(api))

// export let handleBulletHitLittleMan = handleBulletHitStatic

export let emitParticleEmit = (api: api) => (state: state, param, needCollisionCheckLoopCount: number) => {
    return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
        [
            api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()),
            state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()),
            (state, blockState) => {
                return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBulletEmitBlockName(), blockState)
            }
        ],
        api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()).getParticleType(),
        param, needCollisionCheckLoopCount)
    // return api.setAbstractState(state, api.ParticleManager.emitPropBullet(api.getAbstractState(state), param, needCollisionCheckLoopCount))
}

export let getAllParticlesForCollisionCheck = (api: api) => (_, state: state) => {
    return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).getAllParticlesForCollisionCheck(state,
        state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletEmitBlockName())
    )
    // return api.ParticleManager.getAllPropBulletParticlesForCollisionCheck(api.getAbstractState(state))
}