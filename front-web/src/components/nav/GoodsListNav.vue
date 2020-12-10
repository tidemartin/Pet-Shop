<template>
  <div>
    <div class="search-nav">
      <div class="search-nav-container" style="width: 1320px;">
        <ul>
          <li style="width:200px;padding: 0px;">
              <div @mouseover="mousein" @mouseout="mouseout" style="padding:0px 38px;">
                <router-link to="/goodsList">
                  全部商品<i class="el-icon-menu el-icon--right"></i>
                </router-link>
              </div>
            <transition name="el-zoom-in-top">
              <div @mouseover="listmousein" @mouseout="mouseout" v-if="typeListV" style="position: absolute;z-index: 998;">
                <div class="search-nav-container-list" style="position: absolute; width: 200px;background-color: white;line-height: 30px;">
                  <div @mouseover="mousein1(item)" @mouseout="mouseout1" v-for="item in typeList" :key="item.id" class="search-nav-container-list-c" >
                    <div style="padding: 1px;" >
                      <router-link  style="padding-left: 3px;color: gray;font-weight: 700;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+item.value">{{item.label}}</router-link>
                      <i style="float: right; padding: 13px;" class="el-icon-arrow-right el-icon--right"></i>
                    </div>
                    <div style="font-size: 14px;display: inline-block;width: 60px;overflow: hidden;text-overflow: clip;height: 25px;margin-right: 5px;" v-for="item1 in item.children" :key="item.id" >
                      <router-link style="padding-left: 3px;color: gray;line-height: 30px;display: block;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+item1.value">{{item1.label}}</router-link>
                    </div>
                  </div>
                </div>
                <transition name="el-zoom-in-top">
                  <div @mouseover="listmousein1" @mouseout="mouseout1" style="width:600px;height: 780px; background-color: white;position:absolute;left: 200px;border: solid 1px orange;z-index: 99999;">
                    <div v-if="selectedType.children" v-for="t2 in selectedType.children" style="display: flex;" >
                      <span style="display: inline-block;font-size: 14px;margin-left: 10px;width: 80px;color: darkorange;font-weight: bold;">
                        <router-link  style="color: gray;font-weight: 700;" class="search-nav-container-list-link" :to="'/goodsList1?typeId='+t2.value">{{t2.label}}</router-link>
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
            </transition>
          </li>
          <li><router-link to="/">
            <router-link class="search-nav-container-list-link" :to="'/goodsList1?typeId=2'">狗狗商品</router-link>
          </router-link></li>
          <li><router-link to="/">
            <router-link class="search-nav-container-list-link" :to="'/goodsList1?typeId=3'">猫猫商品</router-link>
          </router-link></li>
          <li><router-link to="/">
            <router-link class="search-nav-container-list-link" :to="'/goodsList1?typeId=4'">小宠商品</router-link>
          </router-link></li>
          <li><router-link to="/">
          <router-link class="search-nav-container-list-link" :to="'/goodsList1?typeId=16'">水族商品</router-link>
        </router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsListNav',
  data(){
    return{
      typeListV:false,
      listmouseinV:false,
      typeList1V:false,
      listmousein1V:false,
      typeList:[],
      typeList3:[],
      selectedType:{}
    }
  },
  created () {
    this.axios.post("/index/goodsType/cascadetype",{}).then(r=>{
        if(r.data.success){
            this.typeList=r.data.data
        }
    })
  },
  methods:{
    mousein(){
      console.info('mousein')
      this.typeListV=true
    },
    mouseout(){
      console.info('mouseout')
      setTimeout(()=>{
        if(!this.listmouseinV){
          this.typeListV=false
        }else{
          this.listmouseinV=false
        }
      },1)
    },
    listmousein(){
      console.info('listmousein')
      this.listmouseinV=true
    },
    mousein1(item){
      console.info('mousein1')
      this.typeList1V=true
      this.selectedType=item
    },
    mouseout1(){
      console.info('mouseout1')
      setTimeout(()=>{
        if(!this.listmousein1V){
          this.typeList1V=false
        }else{
          this.listmousein1V=false
        }
      },1)
    },
    listmousein1(){
      console.info('listmousein1')
      this.listmousein1V=true
    },
  }
};
</script>

<style scoped>
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
.search-nav-container ul{
  margin: 0px;
  padding-left: 0px;
  list-style: none;
}
.search-nav-container li{
  cursor: pointer;
  margin-left: 30px;
  line-height: 45px;
  color: white;
  font-size: 18px;
  /*font-weight: bold;*/
  float: left;
}
.search-nav-container li a a{
  color: white;
}
.search-nav-container a{
  color: #C81623;
  text-decoration: none;
}
.search-nav-container li:first-child{
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
.search-nav-container-list-link:hover{
  text-decoration: underline;
}
</style>
