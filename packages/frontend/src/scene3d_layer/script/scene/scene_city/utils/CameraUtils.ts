export let getFarFactorByScale = (girlScale) => {
    let factor
    if (girlScale < 50) {
        factor = 1
    }
    else if (girlScale < 100) {
        factor = 1.5
    }
    else if (girlScale <= 400) {
        factor = 2
    }
    else {
        factor = 3
    }

    return factor
}