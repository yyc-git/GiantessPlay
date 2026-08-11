import { autoDifficulty } from "../../scene3d_layer/script/scene/scene_city/type/StateType"

export let getAutoDifficultyClassName = (value: autoDifficulty) => {
    switch (value) {
        case autoDifficulty.VeryEasy:
            return "white"
        case autoDifficulty.Easy:
            return "green"
        case autoDifficulty.Middle:
        case autoDifficulty.Hard:
            return "blue"
        case autoDifficulty.VeryHard:
        case autoDifficulty.VeryHard1:
            return "purple"
        case autoDifficulty.VeryHard2:
        case autoDifficulty.VeryHard3:
            return "orange"
        case autoDifficulty.VeryHard4:
            return "orangered"
        case autoDifficulty.VeryHard5:
            return "red"
        default:
            throw new Error("err")
    }
}