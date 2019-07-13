const KEY_LANG = 'language'
export const localSave = (key, value) => {
    localStorage.setItem(key, value)
  }
  
  export const localRead = (key) => {
    return localStorage.getItem(key) || ''
  }

  
  export const setLanguage = (value) => {
    return localSave(KEY_LANG,value)
  }

  export const getLanguage = () => {
    return localRead(KEY_LANG)
  }

  