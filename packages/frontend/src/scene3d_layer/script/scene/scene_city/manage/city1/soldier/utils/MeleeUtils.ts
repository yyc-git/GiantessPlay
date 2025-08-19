import * as SoldierUtils from "./SoldierUtils"

export let getNamePrefix = () => `${SoldierUtils.getNamePrefix()}_melee`

export let getFlameVehicleNamePrefix = () => `flameVehicle`

export let isMelee = (name: string) => {
    return name.includes(getNamePrefix())
}

export let isMeleeOrFlameVehicle = (name: string) => {
    return name.includes(getNamePrefix()) || name.includes(getFlameVehicleNamePrefix())
}
