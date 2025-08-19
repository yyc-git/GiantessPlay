import type { Mesh, Object3D } from "three"
import { isInstanceSource, setVisible } from "../instance/Instance"
import { state } from "../type/StateType"
import { nullable } from "./nullable"

export let isEqualByName = (obj1: Object3D, obj2: Object3D) => {
    return obj1.name == obj2.name
}

export let markAllMeshesNotVisible = (object: Object3D) => {
    if ((object as Mesh).isMesh) {
        // throw new Error("shouldn't be Mesh")

        object.visible = false
    }

    object.traverse(child => {
        if ((child as Mesh).isMesh) {
            child.visible = false
        }
    })
}

export let markAllVisibilty = (state: state, object: Object3D, visibility) => {
    let newState = state

    object.traverse(obj => {
        if (isInstanceSource(newState, obj)) {
            newState = setVisible(newState, obj, visibility)
        }

        obj.visible = visibility

        return newState
    })

    return newState
}

export let markAllMeshesVisible = (object: Object3D) => {
    if ((object as Mesh).isMesh) {
        throw new Error("shouldn't be Mesh")
    }

    object.traverse(child => {
        if ((child as Mesh).isMesh) {
            child.visible = true
        }
    })
}

export let markNotFrustumCulled = (object: Object3D) => {
    object.traverse(obj => {
        obj.frustumCulled = false
    })
}

export let markNeedsUpdate = <T extends Object3D>(object: T) => {
    object.matrixWorldNeedsUpdate = true
    object.matrixAutoUpdate = true
    object.matrixWorldAutoUpdate = true

    return object
}

export let markNotNeedsUpdate = <T extends Object3D>(object: T) => {
    object.matrixWorldNeedsUpdate = false
    object.matrixAutoUpdate = false
    object.matrixWorldAutoUpdate = false

    return object
}

export let changeTransformToDefault = <T extends Object3D>(obj: T) => {
    obj.position.set(0, 0, 0)
    obj.quaternion.set(0, 0, 0, 1)
    obj.scale.set(1, 1, 1)

    return obj
}

export let group = (objects: Array<Object3D>, getIdFunc) => {
    return objects.reduce((objectGroup, obj) => {
        let id = getIdFunc(obj)

        if (objectGroup[id] == undefined) {
            objectGroup[id] = [obj]
        }
        else {
            objectGroup[id].push(obj)
        }

        return objectGroup
    }, {})
}

export let findObjectByName = <T extends Object3D>(obj: Object3D, name): nullable<T> => {
    return obj.getObjectByName(name) as nullable<T>
}

export let findObjects = (obj: Object3D, isMatchFunc) => {
    let result = []

    obj.traverse(object => {
        if (isMatchFunc(object)) {
            result.push(object)
        }
    })

    return result
}
