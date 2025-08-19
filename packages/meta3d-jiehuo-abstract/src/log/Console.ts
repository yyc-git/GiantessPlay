export let markIsProductionToGlobalThis = () => {
    globalThis["isProduction"] = true
}

export let log = (...args) => {
    if (!globalThis["isProduction"]) {
        console.log(...args)
    }
}

export let warn = (...args) => {
    if (!globalThis["isProduction"]) {
        console.warn(...args)
    }
}