import Vue from 'vue';

// 获取轮播(营销)图片
export const loadCarouselItems = ({ commit }) => {
  return Vue.axios.post("/index/data",{slot:"idx_lb"}).then(r=>{
    if(r.data.success){
      let data={
        carouselItems: r.data.data
      }
      commit('SET_CAROUSELITEMS_INFO', data);
    }
  })
};

export const loadBrandItems = ({ commit }) => {
  return Vue.axios.post("/index/data",{slot:"idx_brand"}).then(r=>{
    if(r.data.success){
      let data={
        activity: r.data.data
      }
      commit('SET_CAROUSELITEMS_INFO', data);
    }
  })
};


// 加载推荐数据
export const loadIndexRecommend = ({ commit }) => {
  return Vue.axios.post("/index/recommend",{}).then(r=>{
      if(r.data.success){
        commit('SET_INDEX_RECOMMEND_INFO', r.data.data);
      }
  })
};

// 加载爱吃专栏数据
export const loadIndexHotGoods = ({ commit }) => {
  return Vue.axios.post("/index/hot",{}).then(r=>{
    if(r.data.success){
      commit('SET_INDEX_HOTGOODS_INFO', r.data.data);
    }
  })
};

// 请求获得商品评价信息
export const loadGoodsEvals = ({ commit },data) => {
  return Vue.axios.post("/index/eval?page="+data.page,data).then(r=>{
    if(r.data.success){
      commit('SET_GOODS_EVAL_INFO', r.data.data.content);
      commit('SET_GOODS_EVAL_PAGE_INFO',{total: r.data.data.totalElements});
    }
    return r.data
  })
};

// 请求获得商品咨询信息
export const loadGoodsMsgs = ({ commit },data) => {
  return Vue.axios.post("/index/livemsg?page="+data.page,data).then(r=>{
    if(r.data.success){
      commit('SET_GOODS_MSG_INFO', r.data.data.content);
      commit('SET_GOODS_MSG_PAGE_INFO', {total: r.data.data.totalElements});
    }
    return r.data
  })
};

// 请求获得商品详细信息
export const loadGoodsInfo = ({ commit },goodsId) => {
  commit('SET_LOAD_STATUS', true);
  return Vue.axios.post("/index/goods/detail",{id:goodsId}).then(r=>{
      if(r.data.success){
        if(r.data.data.imgList&&r.data.data.imgList.length>0){
          r.data.data.imgUrl=r.data.data.imgList[0].imgUrl
        }
        commit('SET_GOODS_INFO', r.data.data);
        commit('SET_LOAD_STATUS', false);
      }
      return r.data
  })
};

// 获取商品列表
export const loadGoodsList = ({ commit },data) => {
  commit('SET_LOAD_STATUS', true);
  data.status=1
  Vue.axios.post("/index/recommend",data).then(r=>{
      if(r.data.success){
        const data = {
          asItems: r.data.data.goodses
        };
        commit('SET_GOODS_LIST', data);
        commit('SET_LOAD_STATUS', false);
      }
  })
  Vue.axios.post("/index/search/adv",data).then(r=>{
    if(r.data.success){
      const data = {
        goodsList: r.data.data.content,
        total:r.data.data.totalElements
      };
      commit('SET_GOODS_LIST', data);
      commit('SET_LOAD_STATUS', false);
      return r.data
    }
  })

};

// 添加购物车
export const addShoppingCart = ({ commit }, data) => {
  Vue.axios.post("/api/shoppingcart/save",data).then(r=>{
    if(r.data.success){
      commit('ADD_SHOPPING_CART', data);
    }
    return data
  })

};

// 获取用户推荐
export const loadRecommend = ({ commit },data) => {
  Vue.axios.post("/index/recommend",data).then(r=>{
      if(r.data.success){
        const data = r.data.data;
        commit('SET_RECOMMEND_INFO', data);
      }
      return r.data
  })
};

export const loadAddress = ({ commit,rootState }) => {
  return Vue.axios.post("/api/useraddress/all", {userId:rootState.userInfo.id}).then(r => {
    if (r.data.success) {
      commit('SET_USER_ADDRESS', r.data.data);
    }
    return r.data
  })
};

//设置立即购买商品
export const setImmShoppingCart = ({ commit,rootState  },data) => {
  commit('SET_IMMSHOPPING_CART', data);
}

export const loadShoppingCart = ({ commit,rootState  }) => {
  if(rootState.userInfo.id) {
    return Vue.axios.post("/api/shoppingcart/all", {userId:rootState.userInfo.id}).then(r => {
      if (r.data.success) {
        commit('SET_SHOPPING_CART', r.data.data);
      }
    })
  }else {
    return new Promise((resolve, reject) => {
      const data = [];
      commit('SET_SHOPPING_CART', data);
    });
  }
};

// 用户登录
export const login = ({ commit }, data) => {
  return Vue.axios.post("/index/login", data).then(r => {
    if (r.data.success) {
      commit('SET_USER_LOGIN_INFO', r.data.data);
    }
    return r.data
  })
};

// 退出登陆
export const signOut = ({ commit }) => {
  return Vue.axios.post("/index/logout", {}).then(r => {
    if (r.data.success) {
      commit('SET_USER_LOGIN_INFO', {});
    }
    return r.data
  })

};

// 判断是否登陆
export const isLogin = ({ commit }) => {
  return Vue.axios.post("/index/user/current",{}).then(r=>{
      if(r.data.success){
        commit('SET_USER_LOGIN_INFO', r.data.data);
      }else{
        commit('SET_USER_LOGIN_INFO', {});
      }
      return r.data
  })
};
