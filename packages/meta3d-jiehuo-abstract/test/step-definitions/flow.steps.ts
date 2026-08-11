import { loadFeature, defineFeature } from "jest-cucumber"
import { Object3D, Mesh } from "three"
import { addDeferExecFuncDataByTime, addOrUpdateDeferExecFuncDataByTime, removeDeferExecFuncData, update } from "../../src/Flow"
import { createState, getDeviceState, setDeviceState } from "../../src/state/State"
import { createSandbox } from "sinon";
import { ArrayUtils } from "../../src/Main";

const feature = loadFeature("./test/features/flow.feature")

defineFeature(feature, test => {
    let sandbox
    let specificState, state
    let func1, func2


    let _getAbstractStateFunc = (specficState) => {
        return specficState.abstract
    }

    let _setAbstractStateFunc = (specficState, state) => {
        specficState.abstract = state

        return specficState
    }

    let _setDelta = (state, value) => {
        state = setDeviceState(state, {
            ...getDeviceState(state),
            delta: value
        })
        return state
    }

    let _buildDeferName = (value) => {
        return String(value)
    }

    let _update = (specificState, count) => {
        return ArrayUtils.reducePromise(
            ArrayUtils.range(0, count - 1),
            (specificState, i) => {
                return update(specificState, [_getAbstractStateFunc, _setAbstractStateFunc])
            }, specificState
        )

    }

    let _prepare = (given) => {
        given("prepare", () => {
            sandbox = createSandbox()
            state = createState()
            specificState = {
                abstract: state
            }

            func1 = sandbox.stub().returns(
                Promise.resolve(specificState)
            )
            func2 = sandbox.stub().returns(
                Promise.resolve(specificState)
            )




            state = _setDelta(state, 1)



            specificState = _setAbstractStateFunc(specificState, state)
        })
    }

    test("case1", ({
        given,
        when,
        then
    }) => {
        _prepare(given)

        given("prepare", () => {
            state = _getAbstractStateFunc(specificState)

            state = addOrUpdateDeferExecFuncDataByTime(state, func1, 2, _buildDeferName(1))

            specificState = _setAbstractStateFunc(specificState, state)
        })

        when("exec", () => {
            return _update(specificState, 2)
        })

        then("right", () => {
            expect(func1).toCalledOnce()
        })
    })

    test("case2", ({
        given,
        when,
        then
    }) => {
        _prepare(given)

        given("prepare", () => {
            state = _getAbstractStateFunc(specificState)

            state = addDeferExecFuncDataByTime(state, func1, 1, _buildDeferName(1))
            state = addOrUpdateDeferExecFuncDataByTime(state, func2, 1, _buildDeferName(1))

            specificState = _setAbstractStateFunc(specificState, state)
        })

        when("exec", () => {
            return _update(specificState, 1)
        })

        then("right", () => {
            expect(func1).not.toCalled()
        })
    })

    test("case3", ({
        given,
        when,
        then
    }) => {
        _prepare(given)

        given("prepare", () => {
            state = _getAbstractStateFunc(specificState)

            state = addDeferExecFuncDataByTime(state, func1, 3, _buildDeferName(1))

            state = addDeferExecFuncDataByTime(state, specificState => {
                state = _getAbstractStateFunc(specificState)

                state = removeDeferExecFuncData(state, _buildDeferName(1))

                specificState = _setAbstractStateFunc(specificState, state)

                return Promise.resolve(specificState)
            }, 1)


            specificState = _setAbstractStateFunc(specificState, state)
        })

        when("exec", () => {
            return _update(specificState, 3)
        })

        then("right", () => {
            expect(func1).not.toCalled()
        })
    })

    test("case4", ({
        given,
        when,
        then
    }) => {
        _prepare(given)

        given("prepare", () => {
            state = _getAbstractStateFunc(specificState)

            state = addDeferExecFuncDataByTime(state, func1, 3, _buildDeferName(1))

            state = addDeferExecFuncDataByTime(state, specificState => {
                state = _getAbstractStateFunc(specificState)

                state = addOrUpdateDeferExecFuncDataByTime(state, func2, 1, _buildDeferName(1))

                specificState = _setAbstractStateFunc(specificState, state)

                return Promise.resolve(specificState)
            }, 1)


            specificState = _setAbstractStateFunc(specificState, state)
        })

        when("exec", () => {
            return _update(specificState, 3)
        })

        then("right", () => {
            expect(func1).not.toCalled()
            expect(func2).toCalledOnce()
        })
    })
})