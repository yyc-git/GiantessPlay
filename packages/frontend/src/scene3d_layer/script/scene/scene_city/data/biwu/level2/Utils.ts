import { NumberUtils } from "meta3d-jiehuo-abstract";

export let getCenterPosition = () => [
    NumberUtils.getRandomInteger(
        0, -150
    ),
    0,
    NumberUtils.getRandomInteger(
        -20, 20
    )
]
