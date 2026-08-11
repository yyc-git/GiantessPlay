import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getCollisionShapeData, getConfigData, getLevelData, getLevelDataExn, onlySetCollisionShapeData, restoreCollisionShapeData, setCollisionShapeData, setConfigData, setLevelData } from "../../CityScene"
import { getCurrentMMDCharacterName, getGirlMesh } from "../../girl/Girl"
import { setMaterialVisibleByName } from "../../utils/MMDUtils"
import { getMMDAnimationHelper, hasMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { getAbstractState } from "../../../../../state/State"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { collisionPart, pose } from "../../type/StateType"
import { shoeType } from "mmd-character-protocol/src/service/ServiceType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { handleShoeFall } from "../../girl/PickPose"
import { getCurrentPose } from "../../girl/Pose"

let _buildKey = (usedGirl) => `${usedGirl}_shoe`

// let _buildCollisionShapeKey = (collisionPart) => `shoe_${collisionPart}`

let _addDirectionScalarOffset = (offset, directionScalarOffset) => {
    return offset.map(d => {
        return {
            ...d,
            value: NullableUtils.getWithDefault(
                NullableUtils.map(d2 => {
                    return d2.value
                }, directionScalarOffset.find(d2 => {
                    return d2.pose == d.pose
                })),
                0
            ) + d.value
        }
    })
}

let _updateSize = (bones) => {
    let size = bones.size

    if (!NullableUtils.isNullable(size.find(d => d.pose == pose.All))) {
        let d = size[0]
        size = [
            {
                pose: pose.Stand,
                value: d.value
            },
            {
                pose: pose.Pick,
                value: d.value
            },
            {
                pose: pose.Crawl,
                value: d.value
            },
            {
                pose: pose.Sit,
                value: d.value
            },
        ]
    }

    return size.map(d => {
        switch (d.pose) {
            case pose.Sit:
                return d
            // return {
            //     ...d,
            //     value: [d.value[0], d.value[1], d.value[2] / 2]
            // }
            default:
                return {
                    ...d,
                    value: [d.value[0], d.value[1] / 2, d.value[2]]
                }
        }
    })
}

let _updateBones = (state, result, data, bones, bonesName, shoeType_) => {
    // state = setLevelData(state, _buildCollisionShapeKey(data.collisionPart), bones)

    // let currentPose = getCurrentPose(state, usedGirl)

    return [state,
        ArrayUtils.push(result, {
            ...data,
            [bonesName]: {
                ...bones,
                frontDirectionScalar: (shoeType_ == shoeType.Heel || shoeType_ == shoeType.RearHeel) ?
                    _addDirectionScalarOffset([
                        {
                            pose: pose.Stand,
                            value: 0.02
                        },
                        {
                            pose: pose.Pick,
                            value: 0.02
                        },
                        {
                            pose: pose.Crawl,
                            value: 0.0
                        },
                        {
                            pose: pose.Sit,
                            value: -0.05
                        },
                    ], bones.frontDirectionScalar)
                    : bones.frontDirectionScalar,
                upDirectionScalar:
                    _addDirectionScalarOffset([
                        {
                            pose: pose.Stand,
                            // value: -0.02
                            value: -0.03
                        },
                        {
                            pose: pose.Pick,
                            // value: -0.02
                            value: -0.03
                        },
                        {
                            pose: pose.Crawl,
                            value: 0.0
                        },
                        {
                            pose: pose.Sit,
                            value: -0.03
                        },
                    ], bones.upDirectionScalar),
                size: _updateSize(bones)
            }
        }
        )
    ]
}

let _adjustFootCollisionShapes = (state: state, usedGirl, currentMMDCharacterName) => {
    // return setConfigData(state, {
    //     ...getConfigData(state),
    //     collisionShapeData: getConfigData(state).collisionShapeData.map(data => {
    //         if (!data.mmds.includes(currentMMDCharacterName)) {
    //             return data
    //         }

    //         switch (data.collisionPart) {
    //             case collisionPart.RightFoot:
    //             case collisionPart.LeftFoot:
    //                 let twoBones = NullableUtils.getExn(data.twoBones)

    //                 state = setLevelData(state, _buildCollisionShapeKey(data.collisionPart), twoBones)

    //                 return {
    //                     ...data,
    //                     twoBones: {
    //                         ...twoBones,
    //                         upDirectionScalar: [
    //                             {
    //                                 pose: pose.All,
    //                                 value: -0.02
    //                             },
    //                         ],
    //                         size: twoBones.size.map(d => {
    //                             return {
    //                                 ...d,
    //                                 value: [d.value[0], d.value[1] / 2, d.value[2]]
    //                             }
    //                         })
    //                     }
    //                 }
    //             default:
    //                 return data
    //         }
    //     })
    // })

    let shoeType = getShoeType(state, usedGirl)


    let d = getCollisionShapeData(state).reduce<any>(([state, result], data) => {
        if (!data.mmds.includes(currentMMDCharacterName)) {
            return [state, ArrayUtils.push(result, data)]
        }

        switch (data.collisionPart) {
            case collisionPart.RightFoot:
            case collisionPart.LeftFoot:
                if (!NullableUtils.isNullable(data.twoBones)) {
                    return _updateBones(state, result, data, NullableUtils.getExn(data.twoBones), "twoBones", shoeType)
                }

                return _updateBones(state, result, data, NullableUtils.getExn(data.oneBone), "oneBone", shoeType)
            default:
                return [state, ArrayUtils.push(result, data)]
        }
    }, [state, []])
    state = d[0]
    let result = d[1]

    return onlySetCollisionShapeData(state, result)
}

let _restoreFootCollisionShapes = (state: state, currentMMDCharacterName) => {
    // return setCollisionShapeData(state, state => {
    //     return getCollisionShapeData(state).map(data => {
    //         if (!data.mmds.includes(currentMMDCharacterName)) {
    //             return data
    //         }

    //         // switch (data.collisionPart) {
    //         //     case collisionPart.RightFoot:
    //         //     case collisionPart.LeftFoot:
    //         //         let twoBones = NullableUtils.getExn(data.twoBones)

    //         //         return {
    //         //             ...data,
    //         //             twoBones: {
    //         //                 ...twoBones,
    //         //                 upDirectionScalar: [
    //         //                     {
    //         //                         pose: pose.All,
    //         //                         value: 0
    //         //                     },
    //         //                 ],
    //         //             }
    //         //         }
    //         //     default:
    //         //         return data
    //         // }

    //         // return NullableUtils.getExn(getConfigData(state).originCollisionShapeData.find(data => data.mmds.includes(currentMMDCharacterName)))


    //         return NullableUtils.getWithDefault(
    //             NullableUtils.map(levelData => {
    //                 if (!NullableUtils.isNullable(data.twoBones)) {
    //                     return {
    //                         ...data,
    //                         twoBones: levelData
    //                     } as any
    //                 }

    //                 return {
    //                     ...data,
    //                     oneBone: levelData
    //                 } as any
    //             }, getLevelData(state, _buildCollisionShapeKey(data.collisionPart))),
    //             data
    //         )
    //     })
    // })

    return restoreCollisionShapeData(state)
}

let _setYOffset = (bone, state, usedGirl, yOffset) => {
    switch (getCurrentPose(state, usedGirl)) {
        case pose.Sit:
        case pose.Crawl:
            return
        default:
            bone.position.setY(bone.position.y + yOffset)
            break
    }
}

export let isRemoveShoe = (state: state, usedGirl) => {
    let helper = getMMDAnimationHelper(getAbstractState(state), usedGirl)

    return MutableRecordUtils.has(helper.ikBoneCustomData, _buildKey(usedGirl))
}

export let handleRemoveShoe = (state: state, usedGirl) => {
    let currentMMDCharacterName = getCurrentMMDCharacterName(state, usedGirl)

    let { ikBones, notIKBones } = NullableUtils.getExn(getConfigData(state).shoeData.find(d => {
        return d.mmdCharacter == currentMMDCharacterName
    })).data

    state = _adjustFootCollisionShapes(state, usedGirl, currentMMDCharacterName)


    // let girlMesh = getGirlMesh(state, usedGirl)

    // hideMaterialNames.forEach(materialName => {
    //     setMaterialVisibleByName(girlMesh, materialName, false)
    // })

    let helper = getMMDAnimationHelper(getAbstractState(state), usedGirl)

    MutableRecordUtils.set(helper.notIKBoneCustomData, _buildKey(usedGirl), (bone) => {
        NullableUtils.forEach(
            ({ yOffset }) => {
                _setYOffset(bone, state, usedGirl, yOffset)
            },
            notIKBones.find(d => {
                return d.name == bone.name
            })
        )
    })
    MutableRecordUtils.set(helper.ikBoneCustomData, _buildKey(usedGirl), (bone) => {
        NullableUtils.forEach(
            ({ yOffset }) => {
                _setYOffset(bone, state, usedGirl, yOffset)
            },
            ikBones.find(d => {
                return d.names.includes(bone.name)
            })
        )
    })

    return handleShoeFall(state, usedGirl)
}

export let disposeShoe = (state: state, usedGirl) => {
    if (!hasMMDAnimationHelper(getAbstractState(state), usedGirl)) {
        return state
    }

    let helper = getMMDAnimationHelper(getAbstractState(state), usedGirl)

    MutableRecordUtils.remove(helper.notIKBoneCustomData, _buildKey(usedGirl))
    MutableRecordUtils.remove(helper.ikBoneCustomData, _buildKey(usedGirl))

    return state
}

export let restoreShoe = (state: state, usedGirl) => {
    let currentMMDCharacterName = getCurrentMMDCharacterName(state, usedGirl)

    state = _restoreFootCollisionShapes(state, currentMMDCharacterName)

    let helper = getMMDAnimationHelper(getAbstractState(state), usedGirl)

    MutableRecordUtils.remove(helper.notIKBoneCustomData, _buildKey(usedGirl))
    MutableRecordUtils.remove(helper.ikBoneCustomData, _buildKey(usedGirl))

    return state

}

let _isRemoveShoe = (state: state, usedGirl) => {
    return MutableRecordUtils.has(getMMDAnimationHelper(getAbstractState(state), usedGirl).notIKBoneCustomData, _buildKey(usedGirl))
}

export let getShoeType = (state: state, usedGirl): shoeType => {
    if (_isRemoveShoe(state, usedGirl)) {
        return shoeType.None
    }

    return NullableUtils.getWithDefault(getConfigData(state).shoeData.find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl)), {
        data: { shoeType: shoeType.None }
    } as any).data.shoeType
}