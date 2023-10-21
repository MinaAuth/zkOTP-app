export const signAuroMessage = async (message) => {
    let signResult = await window.mina.signMessage({
        message: message,
    }).catch(err => err)
    // if (signResult.signature) {
    //     signMessageResult.innerHTML = JSON.stringify(signResult.signature)
    // } else {
    //     signMessageResult.innerHTML = signResult.message
    // }
    return signResult
}