import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false, // 是否展示loading动画
    orderBy: '', // 根据什么字段排序
    goodsInfo: { // 商品详情
      imgList: [],
      title: '',
      price: 0,
      setMeal: [],
      remarks: []
    },
    userInfo: { // 用户信息
      username: '',
      ye:0
    },
    signUpStep: 0, // 登陆步骤
    marketing: { // 营销
      CarouselItems: [], // 轮播图
      activity: [] // 活动
    },
    indexRecommend: {}, // 首页推荐
    indexHotGoods: {}, // 热卖
    asItems: [], // 广告
    goodsList: [], // 商品列表
    totalGoods:0,
    shoppingCart: [], // 购物车
    immShoppingCart:[],//立即购买
    newShoppingCart: {goodsInfo:{}}, // 刚加入的购物车，作为展示
    recommend: {goodses:[],brands:[]}, // 推荐购买
    address:[],
    evalInfo:[],
    evalPageInfo:{},
    msgInfo:[],
    msgPageInfo:{}
  },
  getters,
  actions,
  mutations
});
