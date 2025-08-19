export let getActualWidth = () => {
    // return document.documentElement.clientWidth
    return window.innerWidth || document.documentElement.clientWidth;
};
export let getActualHeight = () => {
    // return document.documentElement.clientHeight
    return window.innerHeight || document.documentElement.clientHeight;
};
export let isNeedHandleLandscape = () => {
    return getActualWidth() <= getActualHeight();
};
export let getWidth = () => {
    return isNeedHandleLandscape() ? getActualHeight() : getActualWidth();
};
export let getHeight = () => {
    return isNeedHandleLandscape() ? getActualWidth() : getActualHeight();
};
//# sourceMappingURL=View.js.map