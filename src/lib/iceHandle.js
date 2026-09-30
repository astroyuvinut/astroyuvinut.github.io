// Shared handle to the live ice scene, so components can pulse it without importing three.
let ice = null

export const setIce = (scene) => { ice = scene }
export const getIce = () => ice
