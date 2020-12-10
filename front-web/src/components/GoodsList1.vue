<template>
  <div>
    <Search :searchData.sync="searchItem" @search="search"></Search>
    <GoodsListNav></GoodsListNav>
    <div class="container">
      <div class="bread-crumb">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon> 首页
          </BreadcrumbItem>
          <BreadcrumbItem to="/goodsList?sreachData=">
            <Icon type="bag"></Icon> {{searchItem}}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <!-- 商品展示容器 -->
      <div class="goods-box">
        <div class="as-box">
          <div class="item-as-title">
            <span>{{typeList.label}}</span>
            <span></span>
          </div>
          <el-collapse v-if="typeList.children" v-model="csOpen">
            <el-collapse-item style="padding-left: 20px;" v-for="item in typeList.children" :title="item.label" :name="item.value+''" :key="item.value+''">
              <div @click="typeClick(ii.value)" style="margin:2px;display: inline-block;" v-for="ii in item.children" :key="ii.value" >
                <span style="padding: 3px;cursor: pointer;" v-if="typeId!=ii.value">{{ii.label}}</span>
                <span style="background-color: lightsalmon;padding: 3px;cursor: pointer;" v-else>{{ii.label}}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="item-as-title">
            <span>商品精选</span>
            <span>推荐</span>
          </div>
          <div class="item-as" v-for="(item,index) in asItems" :key="index">
            <div class="item-as-img">
              <router-link :to="'/goodsDetail?goodsId='+item.id">
                <img style="width: 100%;" :src="item.imgUrl" alt="">
              </router-link>
            </div>
            <div class="item-as-price">
              <span>
                <Icon type="social-yen text-danger"></Icon>
                <span class="seckill-price text-danger">{{item.price}}</span>
              </span>
            </div>
            <div class="item-as-intro">
              <span>{{item.subtitle}}</span>
            </div>
            <div class="item-as-selled">
              已有<span>{{item.evalCont?item.evalCont:0}}</span>人评价
            </div>
          </div>
        </div>
        <div class="goods-list-box">
          <!-- 商品标签导航 -->
          <GoodsClassNav :show-type="false" @itemClick="searchParamClick"></GoodsClassNav>
          <div class="goods-list-tool">
            <ul>
              <li v-for="(item,index) in goodsTool" :key="index" @click="doOrderBy(item.en, index)"><span :class="{ 'goods-list-tool-active': isAction[index]}">{{item.title}} <Icon :type="icon[index]"></Icon></span></li>
            </ul>
          </div>
          <div class="goods-list">
            <div class="goods-show-info" v-for="(item, index) in orderGoodsList" :key="index">
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
              <div class="goods-show-num">
                已有<span>{{item.evalCont?item.evalCont:0}}</span>人评价
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-page">
        <Page :current="pageInfo.page" :total="totalGoods" :page-size="pageInfo.size" @on-change="pageChange" ></Page>
      </div>
    </div>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>
import Search from '@/components/Search';
import GoodsClassNav from '@/components/nav/GoodsClassNav';
import store from '@/vuex/store';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import GoodsListNav from './nav/GoodsListNav';
export default {
  name: 'GoodsList',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  beforeRouteUpdate(to,from,next){
    next();
    this.searchItem = this.$route.query.sreachData;
    let d=this.buildSearchParam()
    this.loadGoodsList(d)
    if(this.$route.query.typeId){
      this.typeId=this.$route.query.typeId
    }
    this.axios.post("/index/goodsType/cascadetype",{}).then(r=>{
      if(r.data.success){
        for (let i = 0; i < r.data.data.length; i++) {
          this.typeList=r.data.data[i]
          let c1=r.data.data[i]
          if(c1.value==this.typeId){
            return
          }
          if(c1.children){
            for (let j = 0; j <c1.children.length; j++) {
              let c2=c1.children[j]
              if(c2.value==this.typeId){
                this.csOpen=c2.value+""
                return
              }
              if(c2&&c2.children)
                for (let k = 0; k < c2.children.length; k++) {
                  let c3=c2.children[k]
                  if(c3.value==this.typeId){
                    this.csOpen=c2.value+""
                    return
                  }
                }
            }
          }
        }
        this.typeList=r.data.data
      }
    })
  },
  data () {
    return {
      searchItem: '',
      brandId:"",
      typeId:"",
      pageInfo:{
        page:1,
        size:28,
        total:0
      },
      isAction: [ true, false, false ],
      icon: [ 'arrow-down-a', 'arrow-down-a', 'arrow-down-a' ],
      goodsTool: [
        {title: '综合', en: 'title'},
        {title: '发布时间', en: 'createTime'},
        {title: '价格', en: 'price'}
      ],
      desc:true,
      csOpen:"",
      typeList:{}
    };
  },
  computed: {
    ...mapState(['asItems', 'isLoading','orderBy','totalGoods']),
    ...mapGetters(['orderGoodsList'])
  },
  methods: {
    ...mapActions(['loadGoodsList']),
    ...mapMutations(['SET_GOODS_ORDER_BY']),
    doOrderBy (data, index) {
      this.icon = [ 'arrow-down-a', 'arrow-down-a', 'arrow-down-a' ];
      this.isAction = [ false, false, false ];
      this.isAction[index] = true;
      this.icon[index] = this.desc?'arrow-down-a':'arrow-up-a';
      let orderBydata=data+" "+(this.desc?"desc":"asc")
      this.desc=!this.desc
      this.SET_GOODS_ORDER_BY(orderBydata);
      let d=this.buildSearchParam()
      this.loadGoodsList(d)
    },
    buildSearchParam(){
      let d={}
      if(this.searchItem){
        d.title=this.searchItem
      }
      if(this.typeId){
        d.typeId=this.typeId
      }
      if(this.brandId){
        d.brandId=this.brandId
      }
      if(this.orderBy){
        d.sort=this.orderBy
      }
      d.page=this.pageInfo.page
      d.size=this.pageInfo.size
      return d
    },
    pageChange(p){
      this.pageInfo.page=p
      let d=this.buildSearchParam()
      this.loadGoodsList(d)
    },
    searchParamClick(data,type){
      if(type=='brand'){
        this.brandId=data.id
      }
      if(type=='type'){
        this.typeId=data.id
      }
      let d=this.buildSearchParam()
      this.loadGoodsList(d)
    },
    typeClick(typeId){
      this.typeId=typeId
      let d=this.buildSearchParam()
      this.loadGoodsList(d)
    },
    search(data){
      let d=this.buildSearchParam()
      this.loadGoodsList(d)
    }
  },
  created () {
    if(this.$route.query.typeId){
      this.typeId=this.$route.query.typeId
    }
    this.searchItem = this.$route.query.sreachData;
    let d=this.buildSearchParam()
    this.loadGoodsList(d)
  },
  mounted () {
    this.axios.post("/index/goodsType/cascadetype",{}).then(r=>{
      if(r.data.success){
        for (let i = 0; i < r.data.data.length; i++) {
          this.typeList=r.data.data[i]
          let c1=r.data.data[i]
          if(c1.value==this.typeId){
            return
          }
          if(c1.children){
            for (let j = 0; j <c1.children.length; j++) {
              let c2=c1.children[j]
              if(c2.value==this.typeId){
                this.csOpen=c2.value+""
                return
              }
              if(c2&&c2.children)
                for (let k = 0; k < c2.children.length; k++) {
                  let c3=c2.children[k]
                  if(c3.value==this.typeId){
                    this.csOpen=c2.value+""
                    return
                  }
                }
            }
          }
        }
        this.typeList=r.data.data
      }
    })
  },
  components: {
    Search,
    GoodsClassNav,
    GoodsListNav
  },
  store
};
</script>

<style scoped>
.container {
  margin: 15px auto;
  width: 1320px;
  min-width: 1000px;
}
.text-danger {
  color: #A94442;
}
.seckill-price{
  margin-right: 5px;
  font-size: 25px;
  font-weight: bold;
}
.goods-box {
  display: flex;
}
/* ---------------侧边广告栏开始------------------- */
.as-box {
  width: 200px;
  border: 1px solid #ccc;
}
.item-as-title{
  width: 100%;
  height: 36px;
  color: #B1191A;
  line-height: 36px;
  font-size: 18px;
}
.item-as-title span:first-child{
  margin-left: 20px;
}
.item-as-title span:last-child{
  float: right;
  margin-right: 15px;
  font-size: 10px;
  color: #ccc;
}
.item-as{
  width: 160px;
  margin: 18px auto;
}
.item-as-img{
  width: 160px;
  height: 160px;
  margin: 0px auto;
}
.item-as-price span{
  font-size: 18px;
}
.item-as-intro{
  margin-top: 5px;
  font-size: 12px;
}
.item-as-selled{
  margin-top: 5px;
  font-size: 12px;
}
.item-as-selled span{
  color: #66c9ff;
}
/* ---------------侧边广告栏结束------------------- */

/* ---------------商品栏开始------------------- */
.goods-list-box {
  margin-left: 15px;
  width: calc(100% - 215px);
}
.goods-list-tool{
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #F1F1F1;
}
.goods-list-tool ul{
  padding-left: 15px;
  list-style: none;
}
.goods-list-tool li{
  cursor: pointer;
  float: left;
}
.goods-list-tool span{
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-left: none;
  line-height: 36px;
  background-color: #fff;
}
.goods-list-tool span:hover{
  border: 1px solid #E4393C;
}
.goods-list-tool i:hover{
  color: #E4393C;
}
.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: #E4393C !important;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
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
  color: #66c9ff;
}
.goods-show-num span{
  color: #66c9ff;
  font-weight: bold;
}
.goods-show-seller{
  font-size: 12px;
  color:#E4393C;
}
.goods-page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/* ---------------商品栏结束------------------- */
</style>
