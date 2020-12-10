// 设置注册步骤
export const SET_SIGN_UP_SETP = (state, step) => {
  state.signUpStep = step;
};

// 设置用户登录信息
export const SET_USER_LOGIN_INFO = (state, data) => {
  state.userInfo = data;
};

// 设置加载状态
export const SET_LOAD_STATUS = (state, status) => {
  state.isLoading = status;
};

// 设置轮播(营销)图
export const SET_CAROUSELITEMS_INFO = (state, { carouselItems, activity }) => {
  if(carouselItems) {
    state.marketing.CarouselItems = carouselItems;
  }
  if(activity) {
    state.marketing.activity = activity;
  }
};

// 设置电脑专栏数据
export const SET_INDEX_RECOMMEND_INFO = (state, indexRecommend) => {
  state.indexRecommend = indexRecommend;
};

// 设置爱吃专栏数据
export const SET_INDEX_HOTGOODS_INFO = (state, indexHotGoods) => {
  state.indexHotGoods = indexHotGoods;
};

// 设置商品列表(搜索)
export const SET_GOODS_LIST = (state, data) => {
  if(data.goodsList!==undefined) {
    state.goodsList = data.goodsList;
    state.totalGoods = data.total
  }
  if(data.asItems){
    state.asItems = data.asItems;
  }
};

// 设置商品列表排序
export const SET_GOODS_ORDER_BY = (state, data) => {
  state.orderBy = data;
};

// 设置商品详细信息
export const SET_GOODS_INFO = (state, data) => {
  state.goodsInfo = data;
};
export const SET_GOODS_EVAL_INFO = (state, data) => {
  state.evalInfo = data;
};
export const SET_GOODS_EVAL_PAGE_INFO = (state, data) => {
  state.evalPageInfo = data;
};
export const SET_GOODS_MSG_INFO = (state, data) => {
  state.msgInfo = data;
};
export const SET_GOODS_MSG_PAGE_INFO = (state, data) => {
  state.msgPageInfo = data;
};

// 添加购物车
export const ADD_SHOPPING_CART = (state, data) => {
  let has=false
  if(state.shoppingCart!=null&&state.shoppingCart.length>0) {
    for (let i = 0; i < state.shoppingCart.length; i++) {
      let r = state.shoppingCart[i]
      if ((r.userId == data.userId) && (r.goodsId = data.goodsId) && (r.goodsSkuId == data.goodsSkuId)) {
        has = true
        r.buyCont += data.buyCont
      }
    }
  }
  if(!has) {
    state.shoppingCart.push(data);
  }
  state.newShoppingCart = data;
};

// 设置购物车信息
export const SET_SHOPPING_CART = (state, data) => {
  state.shoppingCart = data;
};

// 设置立即购买信息
export const SET_IMMSHOPPING_CART = (state, data) => {
  state.immShoppingCart = data;
};

// 设置推荐信息
export const SET_RECOMMEND_INFO = (state, data) => {
  state.recommend = data;
};

// 设置收获地址
export const SET_USER_ADDRESS = (state, data) => {
  state.address = data;
};
