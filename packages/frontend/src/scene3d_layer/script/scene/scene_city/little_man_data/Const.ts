import { getName as getSceneName } from "../CityScene"
import { getName } from "../little_man/LittleMan"
import { animationName } from "./DataType"

export let getAnimationFrameCount = (animationName_) => {
    const frameCountMap = {
        [animationName.Idle]: 60,
        // [animationName.Idle]: 100,
        // [animationName.Run]: 24,
        [animationName.Run]: 26,
        // [animationName.FastRun]: 22,
        [animationName.Shoot]: 34,
        [animationName.Swiping]: 81,
        // [animationName.VeryFastShoot]: 7,
        // [animationName.Shake]: 25,
        [animationName.Shake]: 37,
        // [animationName.Death]: 40,
        [animationName.Death]: 46,

        // [animationName.Controlled]: 91,
        [animationName.Controlled]: 126,

        [animationName.Lie]: 2,
        [animationName.Standup]: 95,

        /*! Climbing Down
        * 
        */
        [animationName.ClimbToDown]: 68,
        /*! Climbing To Top
        * 
        */
        [animationName.ClimbToTop]: 120,
    }

    return frameCountMap[animationName_]
}

export let getElyResourcePath = (name) => `./resource/${name}/little_man/soldier1/Ely/Ely By K.Atienza.fbx`

export let getDreyarResourcePath = (name) => `./resource/${name}/little_man/soldier1/Dreyar/Dreyar By M.Aure.fbx`

// export let getCh09ResourcePath = (name) => `./resource/${name}/little_man/soldier1/Ch09/Ch09_nonPBR.fbx`

export let getMouseyResourcePath = (name) => `./resource/${name}/little_man/soldier1/Mousey/Mousey_nonPBR.fbx`

export let getNinjaResourcePath = (name) => `./resource/${name}/little_man/soldier1/Ninja/Ninja_nonPBR.fbx`

// export let getCh36ResourcePath = (name) => `./resource/${name}/little_man/soldier1/Ch36/Ch36_nonPBR.fbx`

export let getAbeResourcePath = (name) => `./resource/${name}/little_man/soldier1/Abe/Abe_nonPBR.fbx`

// export let getCh45ResourcePath = (name) => `./resource/${name}/little_man/soldier1/Ch45/Ch45_nonPBR.fbx`

export let getMariaResourcePath = (name) => `./resource/${name}/little_man/soldier1/Maria/Maria J J Ong.fbx`

export let getMutantResourcePath = (name) => `./resource/${name}/little_man/soldier1/Mutant/Mutant.fbx`

export let getInfantryResourcePath = (name) => `./resource/${name}/little_man/soldier1/Infantry/infantry.fbx`

export let getDreyarResourceId = () => `${getSceneName()}_${getName()}_${getDreyarResourcePath(getName())}`

export let getElyResourceId = () => `${getSceneName()}_${getName()}_${getElyResourcePath(getName())}`

// export let getCh09ResourceId = () => `${getSceneName()}_${getName()}_${getCh09ResourcePath(getName())}`

export let getMouseyResourceId = () => `${getSceneName()}_${getName()}_${getMouseyResourcePath(getName())}`

export let getNinjaResourceId = () => `${getSceneName()}_${getName()}_${getNinjaResourcePath(getName())}`

// export let getCh36ResourceId = () => `${getSceneName()}_${getName()}_${getCh36ResourcePath(getName())}`

export let getAbeResourceId = () => `${getSceneName()}_${getName()}_${getAbeResourcePath(getName())}`

// export let getCh45ResourceId = () => `${getSceneName()}_${getName()}_${getCh45ResourcePath(getName())}`

export let getMariaResourceId = () => `${getSceneName()}_${getName()}_${getMariaResourcePath(getName())}`

export let getMutantResourceId = () => `${getSceneName()}_${getName()}_${getMutantResourcePath(getName())}`

export let getInfantryResourceId = () => `${getSceneName()}_${getName()}_${getInfantryResourcePath(getName())}`



export let getIdleAnimationResourcePath = (name) => `./resource/${name}/little_man/Idle.fbx`

export let getRunningAnimationResourcePath = (name) => `./resource/${name}/little_man/Running.fbx`

export let getShakeAnimationResourcePath = (name) => `./resource/${name}/little_man/Shake.fbx`

export let getShootingAnimationResourcePath = (name) => `./resource/${name}/little_man/Shooting.fbx`

export let getSwipingAnimationResourcePath = (name) => `./resource/${name}/little_man/Swiping.fbx`

export let getVeryFastShootingAnimationResourcePath = (name) => `./resource/${name}/little_man/VeryFastShooting.fbx`

export let getControlledAnimationResourcePath = (name) => `./resource/${name}/little_man/Controlled.fbx`

export let getStandupAnimationResourcePath = (name, modelName) => `./resource/${name}/little_man/soldier1/${modelName}/Standup.fbx`

export let getLieAnimationResourcePath = (name, modelName) => `./resource/${name}/little_man/soldier1/${modelName}/Lie.fbx`

export let getDeathAnimationResourcePath = (name, modelName) => `./resource/${name}/little_man/soldier1/${modelName}/Death.fbx`

export let getClimbToTopAnimationResourcePath = (name, modelName) => `./resource/${name}/little_man/soldier1/${modelName}/ClimbToTop.fbx`

export let getClimbToDownAnimationResourcePath = (name, modelName) => `./resource/${name}/little_man/soldier1/${modelName}/ClimbToDown.fbx`




export let getBasicGunResourcePath = (name) => `./resource/${name}/little_man/soldier1/gun/basicGun.glb`

export let getBasicGunResourceId = () => `${getSceneName()}_${getName()}_${getBasicGunResourcePath(getName())}`

export let getLaserGunResourcePath = (name) => `./resource/${name}/little_man/soldier1/gun/laserGun.glb`

export let getLaserGunResourceId = () => `${getSceneName()}_${getName()}_${getLaserGunResourcePath(getName())}`

export let getRocketGunResourcePath = (name) => `./resource/${name}/little_man/soldier1/gun/rocketGun.glb`

export let getRocketGunResourceId = () => `${getSceneName()}_${getName()}_${getRocketGunResourcePath(getName())}`

export let getPropGunResourcePath = (name) => `./resource/${name}/little_man/soldier1/gun/propGun.glb`

export let getPropGunResourceId = () => `${getSceneName()}_${getName()}_${getPropGunResourcePath(getName())}`




export let getAimResourcePath = (name) => `./resource/${name}/little_man/soldier1/aim.png`

export let getAimResourceId = () => `${getSceneName()}_${getName()}_${getAimResourcePath(getName())}`





export let getBlinkSoundResourceId = () => "blink"

export let getQTESuccessSoundResourceId = () => "qte_success"

export let getQTEFailSoundResourceId = () => "qte_fail"

export let getQTEStartSoundResourceId = () => "qte_start"

export let getClimbToTopSoundResourceId = () => "climbToTop"

export let getClimbToDownSoundResourceId = () => "climbToDown"