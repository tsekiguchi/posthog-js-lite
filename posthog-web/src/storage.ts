export type PostHogStorage = {
  getItem: (key: string) => string | null | undefined
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
  getAllKeys: () => readonly string[]
}

// Methods partially borrowed from quirksmode.org/js/cookies.html
export const cookieStore: PostHogStorage = {
  getItem(key) {
    try {
      const nameEQ = key + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length))
        }
      }
    } catch (err) {}
    return null
  },

  setItem(key: string, value: string) {
    try {
      const cdomain = '',
        expires = '',
        secure = ''

      const new_cookie_val =
        key + '=' + encodeURIComponent(JSON.stringify(value)) + expires + '; path=/' + cdomain + secure
      document.cookie = new_cookie_val
    } catch (err) {
      return
    }
  },

  removeItem(name) {
    try {
      cookieStore.setItem(name, '')
    } catch (err) {
      return
    }
  },
  clear() {
    document.cookie = ''
  },
  getAllKeys() {
    const ca = document.cookie.split(';')
    const keys = []

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length)
      }
      keys.push(c.split('=')[0])
    }

    return keys
  },
}

const createStorageLike = (store: any): PostHogStorage => {
  return {
    getItem(key) {
      return store.getItem(key)
    },

    setItem(key, value) {
      store.setItem(key, JSON.stringify(value))
    },

    removeItem(key) {
      store.removeItem(key)
    },
    clear() {
      store.clear()
    },
    getAllKeys() {
      const keys = []
      for (const key in localStorage) {
        keys.push(key)
      }
      return keys
    },
  }
}

export const _localStore = createStorageLike(window.localStorage)
export const _sessionStore = createStorageLike(window.sessionStorage)

const checkStoreIsSupported = (storage: PostHogStorage, key = '__mplssupport__'): boolean => {
  if (!window) {
    return false
  }
  try {
    const val = 'xyz'
    storage.setItem(key, val)
    if (storage.getItem(key) !== val) {
      return false
    }
    storage.removeItem(key)
    return true
  } catch (err) {
    return false
  }
}

export const localStore = checkStoreIsSupported(_localStore) ? _localStore : undefined
export const sessionStorage = checkStoreIsSupported(_sessionStore) ? _sessionStore : undefined
