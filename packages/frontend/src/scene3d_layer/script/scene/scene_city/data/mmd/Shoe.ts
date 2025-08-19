import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getConfigData, setConfigData } from "../../CityScene"
import { getCurrentMMDCharacterName, getGirlMesh } from "../../girl/Girl"
import { setMaterialVisibleByName } from "../../utils/MMDUtils"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { getAbstractState } from "../../../../../state/State"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { collisionPart, pose } from "../../type/StateType"

let _getKey = () => "shoe"

let _adjustFootCollisionShapes = (state: state, currentMMDCharacterName) => {
    return setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: getConfigData(state).collisionShapeData.map(data => {
            if (!data.mmds.includes(currentMMDCharacterName)) {
                return data
            }

            switch (data.collisionPart) {
                case collisionPart.RightFoot:
                case collisionPart.LeftFoot:
                    let twoBones = NullableUtils.getExn(data.twoBones)

                    return {
                        ...data,
                        twoBones: {
                            ...twoBones,
                            upDirectionScalar: [
                                {
                                    pose: pose.All,
                                    value: -0.02
                                },
                            ],
                            size: twoBones.size.map(d => {
                                return {
                                    ...d,
                                    value: [d.value[0], d.value[1] / 2, d.value[2]]
                                }
                            })
                        }
                    }
                default:
                    return data
            }
        })
    })
}

export let handleRemoveShoe = (state: state) => {
    let currentMMDCharacterName = getCurrentMMDCharacterName(state)

    let { ikBones, notIKBones } = NullableUtils.getExn(getConfigData(state).shoeData.find(d => {
        return d.mmdCharacter == currentMMDCharacterName
    })).data

    state = _adjustFootCollisionShapes(state, currentMMDCharacterName)


    // let girlMesh = getGirlMesh(state)

    // hideMaterialNames.forEach(materialName => {
    //     setMaterialVisibleByName(girlMesh, materialName, false)
    // })

    let helper = getMMDAnimationHelper(getAbstractState(state))

    MutableMapUtils.set(helper.notIKBoneCustomData, _getKey(), (bone) => {
        NullableUtils.forEach(
            ({ yOffset }) => {
                bone.position.setY(bone.position.y + yOffset)
            },
            notIKBones.find(d => {
                return d.name == bone.name
            })
        )
    })
    MutableMapUtils.set(helper.ikBoneCustomData, _getKey(), (bone) => {
        NullableUtils.forEach(
            ({ yOffset }) => {
                bone.position.setY(bone.position.y + yOffset)
            },
            ikBones.find(d => {
                return d.names.includes(bone.name)
            })
        )
    })

    return state
}

export let disposeShoe = (state: state) => {
    let helper = getMMDAnimationHelper(getAbstractState(state))

    MutableMapUtils.remove(helper.notIKBoneCustomData, _getKey())
    MutableMapUtils.remove(helper.ikBoneCustomData, _getKey())

    return state
}