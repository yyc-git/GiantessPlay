import { NullableUtils } from "meta3d-jiehuo-abstract"

export let closeHandler = (handler) => {
    handler.current?.close()
    handler.current = NullableUtils.getEmpty()
}