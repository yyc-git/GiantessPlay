import { nullable } from "block/src/Type"

export type state = {
    oldValue: nullable<any>,
    startTime?: number,
    pauseTime?: nullable<number>,

    customData?: any,
}
