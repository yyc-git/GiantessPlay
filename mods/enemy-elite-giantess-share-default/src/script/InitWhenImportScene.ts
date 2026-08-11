import { api } from "type-api/src/Type"
import { getEliteGiantessSkinMesh, getProtocolName, getQueue, getState, setClipData, setData, setState } from "./Utils"
// import { state } from "frontend/src/scene3d_layer/type/StateType";

export let initWhenImportScene = (api: api, state,
    [
        buildCategoryNameFunc,
        buildSkinLODNameFunc,
        updateBoxFunc,
    ],

    modelData,
    // blockName,
    // modelName,
    animationData
) => {
    let { resourceId, resourcePath } = modelData

    return api.ModelLoader.parseFbx(api.getAbstractState(state), api.load.getResource(api.getAbstractState(state), resourceId), resourcePath).then(model => {
        return api.ArrayUtils.reducePromise(animationData, (animations, [animationName, animationPath]) => {
            return api.ModelLoader.parseFbx(api.getAbstractState(state), api.load.getResource(api.getAbstractState(state), animationName), animationPath).then(animationGroup => {
                return api.ArrayUtils.push(animations,
                    api.gameObject.getAnimationClip(animationGroup)
                )
            })
        }, [])
            .then(animations => {
                state = setState(api, state, {
                    ...getState(api, state),
                    initialQuaternionMap: api.MutableMapUtils.set(getState(api, state).initialQuaternionMap, buildCategoryNameFunc(api, state),
                        api.quaternion.clone(getEliteGiantessSkinMesh(api)(model).quaternion)
                    ),
                })

                let newModel = api.addBoneGroup(model)

                state = api.setBonePositionOffset(state, newModel, modelData.positionOffset)


                let mesh = getEliteGiantessSkinMesh(api)(newModel)
                mesh.material = api.fixGiantessModelMaterial(api)(mesh.material)


                let data = api.parseCharacterQueue(
                    state, [
                    () => buildCategoryNameFunc(api, state),
                    getEliteGiantessSkinMesh(api),
                    setData(api),
                    buildSkinLODNameFunc,
                    // box => {
                    //     return box.clone().setFromCenterAndSize(box.getCenter(_v1), box.getSize(_v2).multiply(_v3.set(0.3, 0.7, 0.9)))
                    // }
                    updateBoxFunc
                ],
                    newModel,
                    // [
                    //     walk.animations[0],
                    //     stompLight.animations[0],
                    //     kickLight.animations[0],
                    //     death.animations[0],
                    //     deathHeadshot.animations[0],
                    //     shake.animations[0],
                    //     idle.animations[0],
                    //     pickedControlled.animations[0],
                    //     lie.animations[0],
                    //     standupFromLie.animations[0],
                    //     // flyBack.animations[0],
                    //     // standupFromFlyBack.animations[0],
                    //     // dizzy.animations[0],
                    // ],
                    animations,
                    // api.getNearDistance,
                    api.getMiddleDistance,
                    api.getScene(state),
                    // _v1.set(0, 0, 0.2),
                    // _v1.set(0.2, 0.0, 0.05),
                    // NullableUtils.return_(_v1.set(6, 6, 9))
                    // NullableUtils.getEmpty(),
                    true
                )
                state = data[0]
                let allClipDurations = data[1]
                let allClipSteps = data[2]

                return setClipData(api, state, buildCategoryNameFunc(api, state), allClipDurations, allClipSteps)
            })
    }).then(state => {
        let abstractState = api.getAbstractState(state)

        abstractState = api.Collision.setPlayerMoveCollisionableContainers(abstractState, api.Collision.getPlayerMoveCollisionableContainers(abstractState).concat([
            getQueue(api, state, buildCategoryNameFunc(api, state))
        ]))

        state = api.setAbstractState(state, abstractState)

        return state
    })
}