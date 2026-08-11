import { collisionPart, pose } from "mmd-character-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { actionName } from "../data/DataType"
import { getInsertBlockService, getKeepUBBlockService, getSitHeavyStressingBlockName, getSitHeavyStressingBreastBlockName, getSitHeavyStressingTrigoneAndButtBlockName, getSkillGiantessProtocolName, getThrustBlockService, getUBHeavyStressingBlockService } from "../../../../mod/SkillGiantessMod"
import { state } from "../../../../type/StateType"
import { getBuffGirlExcitementBlockName, getBuffLevelGiantessExcitementBlockName, getBuffProtocolName } from "../../../../mod/BuffMod"
import { service } from "buff-protocol/src/service/ServiceType"
import { handleUBFall } from "./PickPose"
import { usedGirl } from "../type/StateType"

export let executeExcitement = (api: api, state, usedGirl: usedGirl, collisionPart_, damagePosition, fromName,
    soundResourceId
) => {
    let action
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getKeepUBBlockService(state).getForceAnimationName():
        case getThrustBlockService(state).getForceAnimationName():
        case getInsertBlockService(state).getForceAnimationName():
            action = getUBHeavyStressingBlockService(state).getActionName()
            break
        default:
            switch (collisionPart_) {
                case collisionPart.LeftBreast:
                case collisionPart.RightBreast:
                    switch (api.getCurrentPose(state, usedGirl)) {
                        case pose.Stand:
                        case pose.Pick:
                            action = actionName.HeavyStressingBreast
                            break
                        case pose.Crawl:
                            action = actionName.CrawlHeavyStressingBreast
                            break
                        case pose.Sit:
                            action = api.blockAPI.getBlockService<any>(state, getSkillGiantessProtocolName(), getSitHeavyStressingBreastBlockName()).getActionName()
                            break
                    }

                    // soundId = getHeavyStressingBreastSoundResourceId()

                    // excitement_ = excitement.High

                    // volumnFactor = 2

                    break
                case collisionPart.TrigoneAndButt:
                    switch (api.getCurrentPose(state, usedGirl)) {
                        case pose.Stand:
                        case pose.Pick:
                            action = actionName.HeavyStressingTrigoneAndButt
                            break
                        case pose.Crawl:
                            action = actionName.CrawlHeavyStressingTrigoneAndButt
                            break
                        case pose.Sit:
                            action = api.blockAPI.getBlockService<any>(state, getSkillGiantessProtocolName(), getSitHeavyStressingTrigoneAndButtBlockName()).getActionName()
                            break
                    }

                    // soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

                    // excitement_ = excitement.VeryHigh

                    // volumnFactor = 2
                    break
                default:
                    // switch (api.getCurrentPose(state, usedGirl)) {
                    //     case pose.Stand:
                    //     case pose.Pick:
                    //         action = actionName.HeavyStressing
                    //         break
                    //     case pose.Crawl:
                    //         action = actionName.CrawlHeavyStressing
                    //         break
                    // }

                    // // soundId = getHeavyStressingSoundResourceId()

                    // // excitement_ = excitement.Low

                    // // volumnFactor = 1
                    // break
                    throw new Error(`unsupport part: ${collisionPart_}`)
            }
    }


    // state = api.setAbstractState(state, api.ParticleManager.emitMilkSplash(api.getAbstractState(state), {
    //     speed: 1,
    //     life: 1000,
    //     size: 60,
    //     position: damagePosition
    //         /*! need change image's anchor from left-bottom to center
    //         * 
    //         */
    //         .add(api.vector3.getTempVector1().set(0, 12, 0))
    //         .toArray()
    // }))
    state = api.setAbstractState(state, api.ParticleManager.emitClothDestroyed(api.getAbstractState(state), {
        speed: 1,
        life: 2000,
        size: 60,
        position: damagePosition.toArray()
    }))

    return api.triggerGirlAction(state, usedGirl, action).then(([state, _]) => {
        // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        //     api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.NumberUtils.clamp(api.getGirlVolume(state, usedGirl, damagePosition) * 2, 0, 1))
        // ))
        state = api.playGiantessVoice(state, usedGirl, soundResourceId, api.NumberUtils.clamp(api.getGirlVolume(state, usedGirl, damagePosition) * 2, 0, 1))

        return state
    })
        .then(state => {
            return api.event.trigger(state, api.getAbstractState, api.event.getGiantessExcitementEventName(), api.buildGiantessStubData(fromName))
        })
}

export let executeClimax = (api: api, state, usedGirl, collisionPart_, damagePosition, fromName, soundResourceId, rewardName) => {
    let action
    //  soundId, volumnFactor,
    //   excitement_
    // switch (collisionPart_) {
    //     case collisionPart.LeftBreast:
    //     case collisionPart.RightBreast:
    //         switch (api.getCurrentPose(state, usedGirl)) {
    //             case pose.Stand:
    //             case pose.Pick:
    //                 action = actionName.HeavyStressingBreast
    //                 break
    //             case pose.Crawl:
    //                 action = actionName.CrawlHeavyStressingBreast
    //                 break
    //         }

    //         // soundId = getHeavyStressingBreastSoundResourceId()

    //         // excitement_ = excitement.High

    //         // volumnFactor = 2

    //         break
    //     case collisionPart.TrigoneAndButt:
    //         switch (api.getCurrentPose(state, usedGirl)) {
    //             case pose.Stand:
    //             case pose.Pick:
    //                 action = actionName.HeavyStressingTrigoneAndButt
    //                 break
    //             case pose.Crawl:
    //                 action = actionName.CrawlHeavyStressingTrigoneAndButt
    //                 break
    //         }

    //         // soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

    //         // excitement_ = excitement.VeryHigh

    //         // volumnFactor = 2
    //         break
    //     default:
    //         // switch (api.getCurrentPose(state, usedGirl)) {
    //         //     case pose.Stand:
    //         //     case pose.Pick:
    //         //         action = actionName.HeavyStressing
    //         //         break
    //         //     case pose.Crawl:
    //         //         action = actionName.CrawlHeavyStressing
    //         //         break
    //         // }

    //         // // soundId = getHeavyStressingSoundResourceId()

    //         // // excitement_ = excitement.Low

    //         // // volumnFactor = 1
    //         // break
    //         throw new Error(`unsupport part: ${collisionPart_}`)
    // }

    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getKeepUBBlockService(state).getForceAnimationName():
        case getThrustBlockService(state).getForceAnimationName():
        case getInsertBlockService(state).getForceAnimationName():
            action = getUBHeavyStressingBlockService(state).getActionName()
            break
        default:
            switch (api.getCurrentPose(state, usedGirl)) {
                case pose.Stand:
                case pose.Pick:
                    action = actionName.HeavyStressing
                    break
                case pose.Crawl:
                    action = actionName.CrawlHeavyStressing
                    break
                case pose.Sit:
                    action = api.blockAPI.getBlockService<any>(state, getSkillGiantessProtocolName(), getSitHeavyStressingBlockName()).getActionName()
                    break
            }
    }

    let size = api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.TrigoneAndButt))) * 3
    let position = api.vector3.add(api.getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt), api.vector3.create(0, -size / 16, 0))
    // let position = api.box3.getBoxBottomPoint(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl,  collisionPart.TrigoneAndButt)), 0, api.vector3.createEmpty())


    state = api.setAbstractState(state, api.ParticleManager.emitMilkSplash(api.getAbstractState(state), {
        speed: 1,
        life: 2000,
        // size: 60,
        // size: 120,
        size: size,
        position: api.vector3.clone(position)
            .toArray(),
        offset: [-0.1, -0.1]
    }))

    state = api.partialScaleBreast(state, usedGirl, 0)

    // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state), api.SoundManager.buildNeedToPlaySoundData(api.getMilkSplashSoundResourceId(), api.getIsDebug(state), api.getGirlVolume(state, usedGirl, api.getLittleManWorldPosition(state)))))
    // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state), api.SoundManager.buildNeedToPlaySoundData(api.getMilkSplashSoundResourceId(), api.getIsDebug(state), api.getGirlVolume(state, usedGirl, damagePosition))))

    state = api.setAbstractState(state, api.Flow.addDeferExecFuncDataByTime(api.getAbstractState(state), (state) => {
        state = api.playGiantessVoice(state, usedGirl, api.getMilkSplashSoundResourceId(), api.getGirlVolume(state, usedGirl, damagePosition))

        return Promise.resolve(state)
    }, 0.5))

    return api.triggerGirlAction(state, usedGirl, action).then(([state, _]) => {
        // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        //     api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.NumberUtils.clamp(api.getGirlVolume(state, usedGirl, damagePosition) * 2, 0, 1))
        // ))
        state = api.playGiantessVoice(state, usedGirl, soundResourceId, api.NumberUtils.clamp(api.getGirlVolume(state, usedGirl, damagePosition) * 2, 0, 1))

        return api.NullableUtils.getWithDefault(
            api.NullableUtils.map(rewardName => {
                return api.generateReward(state, fromName, rewardName, api.girl.buildNameByUsedGirl(usedGirl), position, api.getGirlPosition(state, usedGirl))
            }, rewardName),
            Promise.resolve(state)
        )
    })
        .then(state => handleUBFall(state, usedGirl))
        .then(state => {
            return api.event.trigger(state, api.getAbstractState, api.event.getGiantessClimaxEventName(), api.buildGiantessStubData(fromName))
        })
}


export let getExcitementBuffSuperPositionCount = (api: api, state: state, usedGirl) => {
    let blockName
    if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
        blockName = getBuffGirlExcitementBlockName()
    }
    else {
        blockName = getBuffLevelGiantessExcitementBlockName()
    }


    let { getName, getTargetName } = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), blockName)

    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(buff => {
            return buff.superPositionCount
        }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
        0
    )
}