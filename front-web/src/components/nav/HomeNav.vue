<template>
  <div>
    <div class="nav-body">
      <!-- 侧边导航 -->
      <div class="nav-side" ref="navSide">
        <div style="position: relative;">
          <div class="search-nav-container-list" style="position: absolute;display: inline-block; width: 200px;background-color: white;line-height: 18px;">
            <div @mouseover="mousein(item)" @mouseout="mouseout" v-for="item in typeList" :key="item.id" class="search-nav-container-list-c" >
              <div style="padding: 1px;cursor: pointer;line-height: 45px;color: #C81623;" >
                <router-link style="padding-left: 3px;color: gray;font-weight: 700;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+item.value">{{item.label}}</router-link>
                <i style="float: right; padding: 13px;" class="el-icon-arrow-right el-icon--right"></i>
              </div>
              <div style="font-size: 14px;display: inline-block;width: 60px;overflow: hidden;text-overflow: clip;height: 25px;margin-right: 5px;" v-for="item1 in item.children" :key="item.id" >
                <router-link style="padding-left: 3px;color: gray;line-height: 22px;display: block;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+item1.value">{{item1.label}}</router-link>
              </div>
            </div>
          </div>
          <transition name="el-zoom-in-top">
            <div v-if="typeList1V" @mouseover="listmousein" @mouseout="mouseout1" style="width:600px;height: 513px;background-color: white;position:absolute;left: 200px;border: solid 1px orange;z-index: 99;">
              <div v-if="selectedType.children" v-for="t2 in selectedType.children"  style="display: flex;" >
                      <span style="display: inline-block;font-size: 14px;margin-left: 10px;width: 80px;color: darkorange;font-weight: bold;">
                        <router-link style="color: gray;font-weight: 700;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+t2.value">{{t2.label}}</router-link>
                      </span>
                <div style="display: inline-block;" >
                        <span v-if="t2.children" v-for="t3 in t2.children" style="font-size: 14px;margin-left: 10px;margin-right: 5px;display: inline-block;">
                          <router-link style="color: gray;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+t3.value">{{t3.label}}</router-link>
                        </span>
                </div>
              </div>
            </div>
          </transition>
        </div>

      </div>
      <div class="nav-content" style="display: flex;flex-direction:column;">
        <!-- 幻灯片 -->
        <div >
          <el-carousel height="515px">
            <el-carousel-item style="height: 100%;" v-for="(item, index) in marketing.CarouselItems" :key="index">
              <router-link to="/goodsList">
                <img style="width: 100%;height: 100%;" :src="item.data">
              </router-link>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState } from 'vuex';
export default {
  name: 'HomeNav',
  data () {
    return {
      panel1: false,
      panel2: false,
      nav: [],
      typeList1V:false,
      listmousein1V:false,
      typeList:[],
      typeList3:[],
      selectedType:{}
    };
  },
  created() {
    this.$http.post("/index/data",{slot:"idx_type"}).then(r=>{
      let x=[]
      let d=r.data.data
      this.axios.post("/index/goodsType/cascadetype",{}).then(r1=>{
          if(r1.data.success){
            let cd=r1.data.data
            this.typeList=cd
            //for (let i = 0; i < cd.length; i++) {
            //  for (let j = 0; j < d.length; j++) {
            //   if(cd[i].value==d[j].id){
            //     this.typeList.push(cd[i])
            //   }
            //  }
            //}
          }
      })
    })
  },
  computed: {
    ...mapState(['marketing'])
  },
  methods: {
    showDetail (index) {
      index === 1 ? (this.panel1 = true) : (this.panel2 = true);
    },
    hideDetail (index) {
      index === 1 ? (this.panel1 = false) : (this.panel2 = false);
    },
    mousein(item){
      console.info('mousein')
      this.typeList1V=true
      this.listmousein1V=true
      this.selectedType=item
    },
    mouseout(){
      console.info('mouseout')
      setTimeout(()=>{
        if(!this.listmousein1V){
          this.typeList1V=false
        }else{
          this.listmousein1V=false
        }
      },3)
    },
    listmousein(){
      console.info('listmousein')
      this.listmousein1V=true
    },
    mouseout1(){
      console.info('mouseout1')
      setTimeout(()=>{
        if(!this.listmousein1V){
          this.typeList1V=false
        }else{
          this.listmousein1V=false
        }
      },3)
    },
  },
  mounted () {

  },
  updated () {

  },
  store
};
</script>

<style scoped>
.nav-item {
  width: 680px;
  height: 36px;
  margin: 0px auto;
}
.nav-item ul {
  list-style: none;
  margin-left: 15px;
}
.nav-item li {
  float: left;
  font-size: 16px;
  font-weight: bold;

  margin-left: 30px;
}
.nav-item a {
  text-decoration: none;
  color: #555555;
}
.nav-item a:hover {
  color: #d9534f;
}
/*大的导航信息，包含导航，幻灯片等*/
.nav-body {
  width: 1320px;
  height: 513px;
  margin: 0px auto;
  display: flex;
}
.nav-side {
  width: 200px;
  height: 100%;
  padding: 0px;
  background-color: white;
}
.nav-side ul {
  width: 100%;
  padding: 0px;
  padding-top: 15px;
  list-style: none;
}
.nav-side li {
  padding: 7.5px;
  padding-left: 15px;
  font-size: 14px;
  line-height: 18px;
}
.nav-side li:hover {
  background: #999395;
}
.nav-side-item:hover {
  cursor: pointer;
  color: #c81623;
}

/*导航内容*/
.nav-content {
  flex: 1;
  margin-left: 15px;
  overflow: hidden;
}
/*导航图片*/
.nav-show-img {
  margin-top: 10px;
}
.nav-show-img:nth-child(2) {
  margin-left: 12px;
}
/*显示商品*/
.content {
  width: 100%;
}
/*显示商品详细信息*/
.detail-item-panel {
  width: 815px;
  height: 513px;
  background-color: #fff;
  position: absolute;
  top: 168px;
  left: 389px;
  z-index: 999;
}
.nav-detail-item {
  margin-left: 26px;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  color: #eee;
}
.nav-detail-item span {
  padding: 6px;
  padding-left: 12px;
  margin-left: 15px;
  font-size: 12px;
  background-color: #6e6568;
}
.nav-detail-item span:hover {
  margin-left: 15px;
  background-color: #f44336;
}
.detail-item-panel ul {
  list-style: none;
}
.detail-item-panel li {
  line-height: 38px;
  margin-left: 40px;
}
.detail-item-title {
  padding-right: 6px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  color: #555555;
}
.detail-item-title:hover {
  color: #d9534f;
}
.detail-item-row a {
  color: #555555;
}
.detail-item{
  font-size: 14px;
  padding-left: 12px;
  padding-right: 8px;
  cursor: pointer;
  border-left: 1px solid #ccc;
}
.detail-item:hover {
  color: #d9534f;
}
.search-nav-container-list{
  font-size: 14px;
  border: solid 1px orange;
  height: 513px;
}
.search-nav-container-list-c{
  border-bottom: solid 1px orange;
}
.search-nav-container-list-c:hover{
  border: solid 1px orange;
  border-bottom: solid 2px orange;
}
.search-nav-container-list-link:hover{
  text-decoration: underline;
}
.search-nav{
  width: 100%;
  height: 45px;
  background-color: orange;
}
.search-nav > .el-card__header{
  padding: 1px;
}
.search-nav-container{
  width: 80%;
  min-width: 1000px;
  height: 45px;
  margin: 0px auto;
}
.search-nav-container-90{
  width: 90%;
}
.nav-body a{
  margin: 0px;
  padding-left: 0px;
  list-style: none;
  font-size: 18px;
}
.nav-body a{
  cursor: pointer;
  line-height: 45px;
  color: #C81623;
  font-size: 14px;
}
.nav-body a{
  color: #C81623;
  text-decoration: none;
}
.nav-body li:first-child{
  padding: 0px 38px;
  background: #FF9500;
  margin: 0px;
}
.search-nav-container-list{
  font-size: 14px;
  border: solid 1px orange;
}
.search-nav-container-list-c{
  border-bottom: solid 1px orange;
}
.search-nav-container-list-c:hover{
  border: solid 1px orange;
  border-bottom: solid 2px orange;
}
</style>
