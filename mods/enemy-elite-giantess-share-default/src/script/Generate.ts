import { api } from "type-api/src/Type"
import { getClipData, getInitialQuaternion, getState, getStateMachine, setState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"

let _initialAttributes = (api: api, state, createInitialStateFunc, value, name, index) => {
    // let { defenseFactor, moveSpeed, attackFactor, critRatioFactor, emitSpeedFactor } = getValue(state)
    let { defenseFactor, moveSpeed, attackFactor, critRatioFactor, emitSpeedFactor, hp } = value

    state = api.setDefenseFactor(state, name, defenseFactor)
    state = api.setMoveSpeed(state, name, moveSpeed)
    state = api.setAttackFactor(state, name, attackFactor)
    state = api.setEmitSpeedFactor(state, name, emitSpeedFactor)
    state = api.setCritRatioFactor(state, name, critRatioFactor)
    // state = api.setMissRatio(state, name,)

    return setState(api, state, {
        ...getState(api, state),
        lodQueueIndexMap: api.MutableMapUtils.set(getState(api, state).lodQueueIndexMap, name, index),
        stateMachineMap: api.MutableMapUtils.set(getState(api, state).stateMachineMap, name, api.StateMachine.create(name, createInitialStateFunc(api, state)())),
        // hpMap: getState(api, state).hpMap.set(name, _getFullHp(state)),
        // hpMap: api.MutableMapUtils.set(getState(api, state).hpMap, name, hp),
        hpMap: getState(api, state).hpMap.set(name, hp),
    })
}

export let generateEliteGiantesses = (
    api: api,
    state: state,
    [
        getMaxVisibleCountFunc,
        getCrowdCountFunc,
        getOffsetFactorFunc,
        buildCategoryNameFunc,
        createInitialStateFunc,
        // initialAttributesFunc,
    ],
    factor,
    // modelName,
    modelData,
    categoryName,
    // shadowQueue,
    modelQueue,
    camp_,
    crowdPositions,
    value,
    // scale
): Promise<state> => {
    // const maxVisibleCount = Math.floor(api.NumberUtils.greaterThan(getMaxVisibleCountFunc(state) * factor, 1))
    // const crowdCount = Math.floor(api.NumberUtils.greaterThan(getCrowdCountFunc(state) * factor, 1))
    const maxVisibleCount = Math.floor(api.NumberUtils.greaterThan(getMaxVisibleCountFunc(state) * factor, 0))
    const crowdCount = Math.floor(api.NumberUtils.greaterThan(getCrowdCountFunc(state) * factor, 0))
    // const offsetFactor = Math.floor(api.NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 5))
    const offsetFactor = Math.floor(api.NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 0))


    // let modelData = EliteGiantessData.getModelData(state, modelName)

    let initialTransform = api.matrix4.compose(
        api.matrix4.create(),
        api.vector3.create(0, 0, 0),
        api.quaternion.clone(getInitialQuaternion(api, state, categoryName)),
        api.vector3.setScalar(api.vector3.create(0, 0, 0), modelData.scalar * value.scale)
    )

    // let crowdData = _randomSelectTwoCrowdData(state, Soldier.getCrowdData(state)).map(position => {
    // 	return {
    // 		name: "",
    // 		position,
    // 		userData: null
    // 	}
    // })

    let crowdData = crowdPositions.map(position => {
        return {
            name: "",
            position,
            userData: null
        }
    })



    // let crowdData = [ {
    // 	name: "",
    // 	position: new Vector3(
    // 		-300, 0, -80
    // 	),
    // 	userData: null
    // } ]


    // let shadowQueue = Rocketeer.getShadowQueue(state)

    return api.generateArmy(state,
        [
            (state,
                initialTransform,
                crowds,
                crowdCount,
                queue,
            ) => {
                return api.generateCharacterCrowd(state,
                    [
                        () => buildCategoryNameFunc(api, state),
                        // initialAttributesFunc
                        (state, name, index) => {
                            return _initialAttributes(api, state, createInitialStateFunc, value, name, index)
                        }
                    ],
                    initialTransform,
                    crowds,
                    crowdCount,
                    queue,
                    // Rocketeer.getShadowQueue(state),
                    // shadowQueue,
                    api.NullableUtils.getEmpty(),
                    getClipData(api, state, categoryName),
                )
            },
            (state, index, newPos) => {
                // updateShadow(shadowQueue, index, newPos)

                let name = modelQueue.getName(index)

                state = api.setCamp(state, name, camp_)
                // state = setAttackTarget(state, name, attackTarget_)


                let box = modelQueue.getBox(index)
                state = api.updateAnimationDurationFactor(state, name, api.box3.getSize(box, api.vector3.getTempVector1()).y)


                return state
            },
            getStateMachine(api)
        ],
        modelQueue,
        initialTransform,
        crowdData,
        [
            maxVisibleCount,
            crowdCount,
            offsetFactor,
        ]
    )
}