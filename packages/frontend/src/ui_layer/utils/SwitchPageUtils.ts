import { Device } from "meta3d-jiehuo-abstract"
import { closeModal, isCloseModal } from "./ModalUtils"

export let deferSwitchPageForGetNewestState = (dispatchFunc, data) => {
    setTimeout(() => {
        dispatchFunc(data)
    }, 30)
}

export let deferSwitchPageForGetNewestStateMultiple = (dispatchFunc, dataArr) => {
    setTimeout(() => {
        dataArr.forEach(data => dispatchFunc(data))
    }, 30)
}

export let deferRefreshPageForGetNewestState = (setRefreshFunc) => {
    setTimeout(() => {
        setRefreshFunc(_ => Math.random())
    }, 30)
}

// export let getDeferCloseModalTime = () => 200
export let getDeferCloseModalTime = () => 150

// let _deferCloseModal = (modalClassName) => {
//     setTimeout(() => {
//         closeModal()
//         if (!isCloseModal(modalClassName)) {
//             _deferCloseModal(modalClassName)
//         }
//     }, getDeferCloseModalTime())
// }

// export let deferCloseModal = (setRefreshFunc, modalClassName) => {
//     _deferCloseModal(modalClassName)

//     if (!Device.isMobile()) {
//         setRefreshFunc(_ => Math.random())
//     }
// }
