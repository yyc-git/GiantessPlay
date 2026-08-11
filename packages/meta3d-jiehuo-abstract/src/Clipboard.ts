// let _queryIsCanWrite = () => {
//     return navigator.permissions.query({ name: "clipboard-write" } as any).then((result) => {
//         return result.state == "granted" || result.state == "prompt"
//     });
// }

export let writeText = (text, [successHandleFunc, failHandleFunc]) => {
    // return _queryIsCanWrite().then(success => {
    //     if (success) {
    //         return navigator.clipboard.writeText(text).then(_ => {
    //             return successHandleFunc()
    //         })
    //     }

    //     return failHandleFunc()
    // })

    return navigator.clipboard.writeText(text).then(_ => {
        return successHandleFunc()
    }).catch(e => failHandleFunc(e))
}