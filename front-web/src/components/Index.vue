<template>
  <div class="container">
    <Search @search="search"></Search>
    <GoodsListNav></GoodsListNav>
    <HomeNav></HomeNav>
    <!-- 商品显示区域 -->
    <div class="content">

      <!-- 推荐 -->
      <div class="item-class">
        <div class="item-class-head item-class-hotgoods-head">
          <span class="item-class-title">推荐商品</span>
          <ul>
            <li v-for="(item, index) in indexRecommend.brands" :key="index">
              <router-link :to="'/goodsList?bradId='+item.id">{{item.name}}</router-link>
            </li>
          </ul>
        </div>
        <div class="goods-list" >
            <div class="goods-show-info" v-for="(item, index) in indexRecommend.goodses" :key="index">
              <div class="goods-show-img">
                <router-link :to="'/goodsDetail?goodsId='+item.id"><img style="width: 100%;" :src="item.imgUrl"/></router-link>
              </div>
              <div class="goods-show-price">
                    <span>
                      <Icon type="social-yen text-danger"></Icon>
                      <span class="seckill-price text-danger">{{item.price}}</span>
                    </span>
              </div>
              <div class="goods-show-detail">
                <span>{{item.subTitle}}</span>
              </div>
            </div>
        </div>
      </div>
      <!-- 热卖专场 -->
      <div class="item-class">
        <div class="item-class-head item-class-hotgoods-head">
          <span class="item-class-title">热卖商品</span>
          <ul>
            <li v-for="(item, index) in indexHotGoods.brands" :key="index">
              <router-link :to="'/goodsList?brandId='+item.id">{{item.name}}</router-link>
            </li>
          </ul>
        </div>
        <div class="goods-list" >
          <div class="goods-show-info" v-for="(item, index) in indexHotGoods.goodses" :key="index" >
            <div class="goods-show-img">
              <router-link :to="'/goodsDetail?goodsId='+item.id"><img style="width: 100%;" :src="item.imgUrl"/></router-link>
            </div>
            <div class="goods-show-price">
              <span>
                <Icon type="social-yen text-danger"></Icon>
                <span class="seckill-price text-danger">{{item.price}}</span>
              </span>
            </div>
            <div class="goods-show-detail">
              <span>{{item.subTitle}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search';
import HomeNav from '@/components/nav/HomeNav';
import store from '@/vuex/store';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import GoodsListNav from './nav/GoodsListNav';
export default {
  name: 'Index',
  created () {
    this.loadCarouselItems();
    this.loadBrandItems()
    this.loadIndexRecommend();
    this.loadIndexHotGoods();
    this.loadShoppingCart();
  },
  mounted () {
    const father = this;
  },
  data () {
    return {
      setIntervalObj: null
    };
  },
  methods: {
    ...mapActions(['loadCarouselItems','loadBrandItems', 'loadIndexRecommend', 'loadIndexHotGoods', 'loadShoppingCart']),
    search(data){
      this.$router.push({path: '/goodsList', query: { sreachData: data }});
    }
  },
  computed: {
    ...mapState([ 'seckills', 'indexRecommend', 'indexHotGoods' ]),
    ...mapGetters([ 'seckillsHours', 'seckillsMinutes', 'seckillsSeconds' ])
  },
  components: {
    GoodsListNav,
    Search,
    HomeNav
  },
  destroyed () {
    clearInterval(this.setIntervalObj);
  },
  store
};
</script>

<style scoped>
.container {
  background-color: #F6F6F6;
}
.content {
  width: 1320px;
  margin: 0px auto;
}
.seckill-icon img {
  width: 35px;
  height: 35px;
  margin-top: 6px;
  margin-left: 15px;
  animation-name: shake-clock;
  animation-duration: 0.3s;
  animation-iteration-count: infinite; /*设置无线循环*/
}
/*定义闹钟震动动画关键帧*/
@keyframes shake-clock {
  0% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
  100% {
    transform: rotate(-8deg);
  }
}
.seckill-text {
  width: 300px;
  height: 100%;
  float: left;
}
.seckill-text .seckill-title {
  font-size: 22px;
  line-height: 50px;
  color: #fff;
}
.seckill-text .seckill-remarks {
  margin-left: 5px;
  font-size: 10px;
  color: #fff;
}
/*倒计时*/
.count-down {
  height: 100%;
  margin-right: 30px;
  line-height: 50px;
  float: right;
}
.count-down-text {
  color: #fff;
}
.count-down-num {
  padding: 3px;
  border-radius: 5px;
  background-color: #440106;
  font-size: 26px;
  font-weight: bold;
  color: #f90013;
}
.count-down-point {
  font-size: 26px;
  font-weight: bold;
  color: #440106;
}

.seckill-content {
  width: 100%;
  height: 280px;
}
.seckill-item {
  width: 183px;
  height: 250px;
  margin-top: 15px;
  margin-left: 15px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  float: left;
}
.seckill-item-img {
  width: 160px;
  height: 160px;
  margin: 0px auto;
  overflow: hidden;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}
.seckill-item-img img {
  width: 130px;
  height: 130px;
  margin-left: 15px;
  margin-top: 15px;
  transition: margin-top 0.3s;
}
.seckill-item-img:hover img {
  margin-top: 6px;
  transition: margin-top 0.3s;
}
.seckill-item-info {
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 12px;
  color: #009688;
}
.seckill-item-info i:first-child {
  font-size: 14px;
}
.seckill-price {
  margin-right: 5px;
  font-size: 25px;
  font-weight: bold;
}
/*****************************秒杀专栏结束*****************************/

/*****************************商品专栏开始*****************************/
.item-class {
  width: 100%;
  margin-top: 15px;
  background-color: #fff;
}
.item-class-head {
  width: 100%;
  height: 50px;
  background-color: orange;
  border-radius: 5px 5px 0px 0px;
}
.item-class-hotgoods-head {
  background-color: #ecb226;
}
.item-class-head ul {
  list-style: none;
  float: right;
  margin-right: 30px;
  line-height: 50px;
}
.item-class-head a {
  padding: 6px;
  margin-left: 15px;
  font-size: 12px;
  background-color: orange;
  border: 1px solid orange;
  text-decoration: none;
  color: #fff;
}
.item-class-hotgoods-head a {
  background-color: #eeb955;
  border: 1px solid #eeb955;
}
.item-class-head a:hover {
  border: 1px solid #fff;
}
.item-class-head li {
  float: left;
}
.item-class-title {
  font-size: 25px;
  line-height: 50px;
  color: #fff;
  margin-left: 15px;
}
.item-class-content {
  width: 49%;
  cursor: pointer;
  border-right: 1px solid #ccc;
  margin-left: 0.9%;
  /*background-color: #cff;*/
  float: left;
}
.item-class-content:nth-child(odd) {
  border: none;
}
.item-content-top {
  width: 100%;
  height: 260px;
}
.item-big-img {
  width: 180px;
  height: 260px;
  overflow: hidden;
  float: left;
}
.item-big-img img {
  margin-left: 0px;
  transition: margin-left 0.3s;
}
.item-big-img:hover img {
  margin-left: -15px;
  transition: margin-left 0.3s;
}
.item-four-img {
  width: 303px;
  margin-left: 8px;
  float: left;
}
.item-four-detail img {
  margin-left: 0px;
  transition: margin-left 0.3s;
}
.item-four-detail:hover img {
  margin-left: -6px;
  transition: margin-left 0.3s;
}
.item-four-detail {
  width: 152px;
  height: 130px;
  margin-left: -1px;
  float: left;
}
.item-four-detail:first-child {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.item-four-detail:last-child {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.item-four-detail-text {
  width: 50px;
  margin-left: 5px;
  margin-top: 15px;
  float: left;
}
.item-four-detail-img {
  width: 96px;
  margin-top: 15px;
  overflow: hidden;
  float: left;
}
.item-four-detail-img img {
  margin-left: 5px;
  width: 90px;
}
.pt_bi_tit {
  font-weight: bold;
  font-size: 12px;
  color: orange;
}
.pt_bi_tit-hotgoods {
  color: #ecb127;
}
.pt_bi_promo {
  color: #00695c;
}
.item-content-bottom {
  width: 100%;
  margin-top: 8px;
}
.item-content-bottom-img {
  width: 156px;
  margin-right: 8px;
  overflow: hidden;
  float: left;
}
.item-content-bottom-img img {
  margin-left: 0px;
  transition: margin-left 0.3s;
}
.item-content-bottom-img:hover img {
  margin-left: -15px;
  transition: margin-left 0.3s;
}
/*****************************商品专栏结束*****************************/

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.goods-show-info{
  width: 240px;
  padding: 10px;
  margin: 15px 0px;
  border: 1px solid #fff;
  cursor: pointer;
}
.goods-show-info:hover{
  border: 1px solid #ccc;
  box-shadow: 0px 0px 15px #ccc;
}
.goods-show-price{
  margin-top: 6px;
}
.goods-show-detail{
  font-size: 16px;
  margin: 6px 0px;
}
.goods-show-num{
  font-size: 12px;
  margin-bottom: 6px;
  color: #009688;
}
.goods-show-num span{
  color: #005AA0;
  font-weight: bold;
}
.goods-show-seller{
  font-size: 12px;
  color:#E4393C;
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
