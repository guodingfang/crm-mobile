export const storageGet = (key) => {
  return localStorage.getItem(key)
}

export const storageSet = (key, value) => {
  return localStorage.setItem(key, value)
}

export const storageRemove = (key) => {
  return localStorage.removeItem(key)
}

export const storageClear = () => {
  return localStorage.clear()
}
