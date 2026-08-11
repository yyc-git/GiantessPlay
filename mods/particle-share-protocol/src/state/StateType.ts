import { camp, id, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { gameObject, quaternion } from "type-api/src/Type"

// export type bulletParticle = {
//     id: id,

//     fromName: name,
//     camp: camp,

//     fromPosition: [number, number, number],

//     // rotation: number,

//     opacity: number,
//     size: number,
//     // maxDistance: number,
//     life: number,
//     // changeLife: number,
//     createTime: number,
//     updateTime: number,
//     speed: number,
//     position: [number, number, number],
//     direction?: [number, number, number],
//     getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],
// }


// export type shotBulletParticle = {
//     id: id,

//     fromName: name,
//     camp: camp,

//     // rotation: number,

//     opacity: number,
//     size: number,
//     // maxDistance: number,
//     life: number,
//     // changeLife: number,
//     createTime: number,
//     updateTime: number,
//     speed: number,
//     position: [number, number, number],

//     direction: [number, number, number],
//     // getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],
// }

// export type bulletEmitterParam = {
//     // rotation: number,
//     // maxDistance: number,
//     life: number,
//     size: number,
//     speed: number,
//     position: [number, number, number],
//     direction?: [number, number, number],
//     getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],

//     fromName: name
//     camp: camp,
// }

export type shotBulletEmitterParam = {
    count: number,
    minOffset: number,
    maxOffset: number,

    life: number,
    size: number,
    speed: number,
    position: [number, number, number],

    direction: [number, number, number],
    // getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],

    fromName: name
    camp: camp,
}


export type billboardParticle = {
    opacity: number,
    life: number,
    createTime: number,
    updateTime: number,
    speed: number,
    position: [number, number, number],

    offset: [number, number],

    planeMesh: gameObject,
}

export type billboardEmitterParam = {
    life: number,
    width: number,
    height: number,
    speed: number,
    position: [number, number, number],

    resourceId: string,

    setQuaternionFunc?: (quaternion: quaternion) => quaternion,
}

export type state = null
