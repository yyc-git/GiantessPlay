import { nullable } from "block/src/Type"
import { bufferGeometry } from "type-api/src/Type"

export enum particleType {
    BulletEmit,
    ShotBulletsEmit,

    BulletHit,

    Billboard,

    Effect,
}

export type state<particle> = {
    geometry: nullable<bufferGeometry>,
    particles: Array<particle>
}
