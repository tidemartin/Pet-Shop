<template>
  <div>
    <div class="item-intro-show">
      <div class="item-intro-recommend">
        <div class="item-recommend-title">
          <p>推荐商品</p>
        </div>
        <div class="item-intro-recommend-column">
          <div class="item-recommend-column" v-for="(item, index) in recommend.goodses" :key="index">
            <div class="item-recommend-img">
              <router-link :to="'/goodsDetail?goodsId='+item.id">
              <img style="width: 100%;" :src="item.imgUrl" alt="">
              </router-link>
            </div>
            <div class="item-recommend-intro">
              <span>
                <span class="item-recommend-top-num">{{index + 1}}</span> 热销{{item.sellCont}}件</span>
              <span class="item-recommend-price">￥{{item.price.toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="flex: 1;width: 100%;" class="item-intro-detail" ref="itemIntroDetail">
        <div class="item-intro-nav item-tabs">
          <Tabs>
            <TabPane label="商品介绍">
              <div class="remarks-title">
                <span>商品介绍</span>
              </div>
              <div class="item-intro-img" ref="itemIntroGoods">
<!--                <img :src="item" alt="" v-for="(item,index) in goodsInfo.goodsDetail" :key="index">-->
                <div v-html="goodsInfo.desp"></div>
              </div>
            </TabPane>
            <TabPane label="商品评价">
              <div class="remarks-container">
                <div class="remarks-title">
                  <span>商品评价</span>
                </div>
                <!--
                <div class="remarks-analyse-box">
                  <div class="remarks-analyse-goods">
                    <i-circle :percent="goodsInfo.evalRate" stroke-color="#66c9ff">
                      <span class="remarks-analyse-num">{{goodsInfo.evalRate}}%</span>
                      <p class="remarks-analyse-title">好评率</p>
                    </i-circle>
                  </div>
                </div>

                <div class="remarks-bar">
                  <span>追评({{goodsInfo.remarks.remarksNumDetail[0]}})</span>
                  <span>好评({{goodsInfo.remarks.remarksNumDetail[1]}})</span>
                  <span>中评({{goodsInfo.remarks.remarksNumDetail[2]}})</span>
                  <span>差评({{goodsInfo.remarks.remarksNumDetail[3]}})</span>
                </div>
                -->
                <div class="remarks-box" v-for="(item,index) in evalInfo" :key="index">
                  <div style="width: 100%;display: flex;">
                    <div class="remarks-user">
                      用户：
                      <span class="remarks-user-name">{{item.username}}</span>
                    </div>
                    <div class="remarks-content-box">
                      <p>
                        <Rate disabled :value="item.star?item.star:0" allow-half class="remarks-star"></Rate>
                      </p>
                      <p class="remarks-content">{{item.msg}}</p>
                      <p class="remarks-sub">
                        <span class="remarks-time">{{getTime(item.createTime)}}</span>
                      </p>
                    </div>
                  </div>
                  <div v-if="item.children" style="display: flex;margin: 0px 1px 1px 30px;border: dashed 1px lightblue;border-radius: 5px;" v-for="(ii,idx) in item.children" :key="idx">
                    <div class="remarks-user">
                      <span class="remarks-user-name">用户 {{ii.username}} 回复：</span>
                    </div>
                    <div class="remarks-content-box">
                      <p class="remarks-content">{{ii.msg}}</p>
                      <p class="remarks-sub">
                        <span class="remarks-time">{{getTime(ii.createTime)}}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="remarks-page">
                  <Page :total="evalPageInfo.total"  size="small"></Page>
                </div>
              </div>
            </TabPane>
            <TabPane label="商品咨询">
              <div class="remarks-title">
                <span>商品咨询</span>
                <el-button style="float: right;margin: 4px;" @click="zixun" size="mini">咨询</el-button>
              </div>
              <div class="item-param-container">
                <div class="remarks-box" style="width: 100%;" v-for="(item,index) in msgInfo" :key="index">
                  <div style="width: 100%;display: flex;">
                    <div class="remarks-user">
                      用户：
                      <span class="remarks-user-name">{{item.username}}</span>
                    </div>
                    <div class="remarks-content-box">
                      <p class="remarks-content">{{item.msg}}</p>
                      <p class="remarks-sub">
                        <span class="remarks-time">{{getTime(item.createTime)}}</span>
                      </p>
                    </div>
                  </div>
                  <div v-if="item.children" style="display: flex;margin: 0px 1px 1px 30px;border: dashed 1px lightblue;border-radius: 5px;" v-for="(ii,idx) in item.children" :key="idx">
                    <div class="remarks-user">
                      <span class="remarks-user-name">用户 {{ii.username}} 回复：</span>
                    </div>
                    <div class="remarks-content-box">
                      <p class="remarks-content">{{ii.msg}}</p>
                      <p class="remarks-sub">
                        <span class="remarks-time">{{getTime(ii.createTime)}}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="remarks-page">
                  <Page :total="msgPageInfo.total"  size="small"></Page>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
    <el-dialog title="留言" :visible.sync="msgFormV"  width="50%">
      <el-input type="text" v-model="msgForm.msg" placeholder="请输入留言内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="msgFormV = false">取 消</el-button>
        <el-button type="primary" @click="doZiXun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/vuex/store';
import {mapActions, mapState} from 'vuex';
import moment from 'moment'
export default {
  name: 'ShowGoodsDetail',
  data () {
    return {
      tagsColor: [ 'blue', 'green', 'red', 'yellow' ],
      msgForm:{},
      msgFormV:false
    };
  },
  computed: {
    ...mapState(['goodsInfo','recommend','evalInfo','userInfo','msgInfo','evalPageInfo','msgPageInfo'])
  },
  created() {
  },
  methods: {
    zixun(){
      if(!this.userInfo.id){
        this.$message.info("请先登录")
        return
      }
      this.msgFormV=true
      this.msgForm={}
      this.msgForm.userId=this.userInfo.id
      this.msgForm.goodsId=this.goodsInfo.id
    },
    doZiXun(){
      this.axios.post("/api/livemsg/save",this.msgForm).then(r=>{
          if(r.data.success){
              this.loadGoodsMsgs({goodsId:this.goodsInfo.id})
            this.$message.info("留言成功")
            this.msgFormV=false
          }
      })
    },
    getTime(d){
      if(d){
        return moment(d).format("YYYY/MM/DD hh:mm")
      }
    },
    ...mapActions(['loadRecommend','loadGoodsMsgs']),
    changeHeight () {
      //let heightCss = window.getComputedStyle(this.$refs.itemIntroGoods).height;
      //console.log(heightCss);
      //heightCss = parseInt(heightCss.substr(0, heightCss.length - 2)) + 89;
      //this.$refs.itemIntroDetail.style.height = heightCss + 'px';
    }
  },
  updated () {
    this.$nextTick(() => {
      setTimeout(this.changeHeight, 100);
      setTimeout(this.changeHeight, 1000);
      setTimeout(this.changeHeight, 3000);
      setTimeout(this.changeHeight, 5000);
      setTimeout(this.changeHeight, 10000);
      setTimeout(this.changeHeight, 15000);
      setTimeout(this.changeHeight, 20000);
      setTimeout(this.changeHeight, 25000);
      setTimeout(this.changeHeight, 30000);
      setTimeout(this.changeHeight, 50000);
    });
  },
  components: {
  },
  store
};
</script>

<style scoped>
/***************商品详情介绍和推荐侧边栏开始***************/
.item-intro-show{
  width: 1320px;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  background-color: white;
}
.item-intro-recommend{
  width: 200px;
  display: flex;
  flex-direction: column;
}
.item-intro-recommend-column{
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px orange;
}
.item-recommend-title{
  width: 100%;
  height: 38px;
  font-size: 16px;
  line-height: 38px;
  color: #fff;
  background-color: #eeb955;
  box-shadow: 0px 0px 5px #eeb955;
  text-align: center;
}
.item-recommend-column{
  margin-top: 15px;
}
.item-recommend-intro{
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.item-recommend-img{
  width: 80%;
  margin: 0px auto;
  cursor: pointer;
}
.item-recommend-img img{
  width: 100%;
}
.item-recommend-top-num{
  color: #fff;
  margin: 0px 2px;
  padding: 1px 5px;
  border-radius: 12px;
  background-color: #66c9ff;
}
.item-recommend-price{
  color: #66c9ff;
  font-weight: bolder;
}
.item-intro-detail{
  margin-left: 30px;
  width: calc(80vw - 300px);
}
.item-intro-nav{
  width: 100%;
  height: 38px;
  background-color: #ffa50082;
  border-bottom:1px solid orange;
}
.item-intro-nav ul{
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.item-intro-nav li{
  float: left;
  height: 100%;
  width: 120px;
  line-height: 38px;
  text-align: center;
  color: #66c9ff;
}
.item-intro-nav li:first-child{
  background-color: #66c9ff;
  color: #fff;
}
.item-intro-img{
  width: 100%;
}
.item-intro-img img{
  width: 100%;
}
/************* 商品参数 *************/
.item-param-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}
.item-param-box {
  padding: 5px;
  padding-left: 30px;
  width: 240px;
  height: 36px;
  font-size: 14px;
  /* text-align: center; */
  /* background-color: #ccc; */
}
.item-param-title {
  color: #232323;
}
.item-param-content {
  color: #999;
}
.remarks-title {
  padding-left: 15px;
  height: 36px;
  font-size: 16px;
  font-weight: bolder;
  line-height: 36px;
  color: #666666;
  background-color: #F7F7F7;
}
.remarks-analyse-box {
  padding: 15px;
  display: flex;
  align-items: center;
}
.remarks-analyse-goods {
  margin-left: 15px;
  margin-right: 15px;
}
.remarks-analyse-num {
  font-size: 26px;
}
.remarks-analyse-title {
  font-size: 12px;
  line-height: 20px;
}
.remarks-bar {
  padding-left: 15px;
  height: 36px;
  line-height: 36px;
  color: #666666;
  background-color: #F7F7F7;
}
.remarks-bar span {
  margin-right: 15px;
}
.remarks-box {
  padding: 15px;
  flex-direction: row;
  border-bottom: 1px #ccc dotted;
}
.remarks-user {
  width: 180px;
}
.remarks-user-name {
  padding-left: 15px;
}
.remarks-content-box {
  width: calc(100% - 180px);
}
.remarks-star {
  background-color: #fff;
}
.remarks-content {
  font-size: 14px;
  color: #232323;
  line-height: 28px;
}
.remarks-sub {
  margin-top: 15px;
  color: #ccc;
  text-align: right;
}
.remarks-time {
  margin-left: 15px;
}
.remarks-page {
  margin: 15px;
  display: flex;
  justify-content:flex-end;
}
/***************商品详情介绍和推荐侧边栏结束***************/
</style>

<style>
/* 改变便签页样式 */
.ivu-tabs-ink-bar {
  background-color: #66c9ff !important;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab{
  border-radius: 0px;
  color: #999;
  height: 38px;
  background: #ffa50082;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active{
  color: #fff;
  background-color: orange;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active:before{
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  color: #fff;
  background: orange;
  position: absolute;
  top: 0;
  left: 0;
}
.ivu-rate-star-full:before, .ivu-rate-star-half .ivu-rate-star-content:before {
  color: #66c9ff;
}
</style>
