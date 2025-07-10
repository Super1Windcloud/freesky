export const useRegisterFinishStore = defineStore("registerFinishStatus", {
  state: () => ({
    finishRegister: false,
  }),
  actions: {
    setFinishRegister(value: boolean) {
      this.finishRegister = value;
    },
  },
});

export const useInstanceUrlStore = defineStore("useInstanceUrlStore", {
  state: () => ({
    instanceUrl: "",
  }),
  getters: {
    getInstanceUrl: (state) => {
      return state.instanceUrl;
    },
  },
  actions: {
    setInstanceUrl(value: string) {
      this.instanceUrl = value;
    },
  },
});

export const useIsLoggedInStore = defineStore("useIsLoggedInStore", {
  state: () => ({
    isLoggedIn: false,
  }),
  getters: {
    getIsLoggedIn: (state) => {
      return state.isLoggedIn;
    },
  },
  actions: {
    setIsLoggedIn(value: boolean) {
      this.isLoggedIn = value;
    },
  },
});

export const useAccessTokenStore = defineStore("useAccessTokenStore", {
  state: () => ({
    accessToken: "",
  }),
  getters: {
    getAccessToken: (state) => {
      return state.accessToken;
    },
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
  },
});


export const useLangStore = defineStore("useLangStore", {
  state: () => ({
    lang: "",
  })
  ,
  getters: {
    getLang: (state) => {
      return state.lang;
    },
  },
  actions: {
    setLang(lang: string) {
      this.lang = lang;
    },
  },
})

export  const  useQueryStore = defineStore("useQueryStore", {
  state: () => ({
    query: "",
  }),
  getters: {
    getQueryText: (state) => {
      return state.query;
    },
  },
  actions: {
    setQueryText(query: string) {
      this.query = query;
    },
  },
})