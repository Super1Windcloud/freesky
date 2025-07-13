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
  }),
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
});

export const useQueryStore = defineStore("useQueryStore", {
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
});

export const useSearchPostDetailStore = defineStore(
  "useSearchPostDetailStore",
  {
    state: () => ({
      searchPostDetail: {},
    }),
    getters: {
      getSearchPostDetail: (state) => {
        return state.searchPostDetail;
      },
    },
    actions: {
      setSearchPostDetail(postDetail: Object) {
        this.searchPostDetail = postDetail;
      },
    },
  },
);

export const useAccountDetailInfoStore = defineStore(
  "useAccountDetailInfoStore",
  {
    state: () => ({
      accountDetailInfo: {},
    }),
    getters: {
      getAccountDetailInfo: (state) => {
        return state.accountDetailInfo;
      },
    },
    actions: {
      setAccountDetailInfo(accountDetailInfo: Object) {
        this.accountDetailInfo = accountDetailInfo;
      },
    },
  },
);

export const useShowCommentStore = defineStore("useShowCommentStore", {
  state: () => ({
    showComment: true,
  }),
  getters: {
    getShowComment: (state) => {
      return state.showComment;
    },
  },
  actions: {
    setShowComment(showComment: boolean) {
      this.showComment = showComment;
    },
  },
});
