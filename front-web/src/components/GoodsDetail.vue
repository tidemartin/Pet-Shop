<template>
  <div>
    <Search @search="search"></Search>
    <GoodsListNav></GoodsListNav>
    <div class="shop-item-path">
      <div class="shop-nav-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon> 首页
          </BreadcrumbItem>
          <BreadcrumbItem to="/goodsList?sreachData=">
            <Icon type="bag"></Icon> 商品详情
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <!-- 商品信息展示 -->
    <ShowGoods ref="showGoods"></ShowGoods>
    <!-- 商品详细展示 -->
    <ShowGoodsDetail></ShowGoodsDetail>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>
import Search from '@/components/Search';
import ShopHeader from '@/components/header/ShopHeader';
import ShowGoods from '@/components/goodsDetail/ShowGoods';
import ShowGoodsDetail from '@/components/goodsDetail/ShowGoodsDetail';
import store from '@/vuex/store';
import GoodsListNav from './nav/GoodsListNav';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'GoodsDetail',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  beforeRouteUpdate(to,from,next){
    next();
    this.$refs.showGoods.reset()
    this.loadGoodsInfo1()
  },
  created () {
    this.loadGoodsInfo1()
  },
  data () {
    return {
      tagsColor: [ 'blue', 'green', 'red', 'yellow' ],
      evalInfo: [],
      evalPageInfo:{page:1,size:0},
      msgInfo:[],
      msgPageInfo:{page:1,size:0}
    };
  },
  methods: {
    ...mapActions(['loadGoodsInfo','loadGoodsEvals','loadGoodsMsgs','loadRecommend']),
    search(data){
      this.$router.push({path: '/goodsList', query: { sreachData: data }});
    },
    loadGoodsInfo1(){
      let goodsId=this.$route.query.goodsId
      this.loadGoodsInfo(goodsId).then(r=>{
        if(!r.data){
          this.$message.error("加载信息错误")
        }
        this.loadGoodsEvals({goodsId,page:1})
        this.loadGoodsMsgs({goodsId,page:1})
        this.loadRecommend({goodsId})
      })
    }
  },
  computed: {
    ...mapState(['goodsInfo', 'isLoading'])
  },
  components: {
    Search,
    ShopHeader,
    ShowGoods,
    ShowGoodsDetail,
    GoodsListNav
  },
  store
};
</script>

<style scoped>
.shop-item-path {
  height: 38px;
  background-color: white;
  line-height: 38px;
  color: #2c2c2c;
}
.shop-nav-container {
  margin: 0px auto;
  width: 1320px;
}
</style>
