<template>
  <div>
    <div class="item-detail-show">
      <div class="item-detail-left">
        <div class="item-detail-big-img">
          <img v-if="goodsInfo.imgList.length>0" :src="goodsInfo.imgList[imgIndex].imgUrl" alt="">
        </div>
        <div class="item-detail-img-row">
          <div class="item-detail-img-small" v-for="(item, index) in goodsInfo.imgList" :key="index" @mouseover="showBigImg(index)">
            <img :src="item.imgUrl" alt="">
          </div>
        </div>
      </div>
      <div class="item-detail-right" style="min-width: 450px;">
        <div class="item-detail-title">
          <p>
            {{goodsInfo.title}}
          </p>
        </div>
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <div class="item-price-row">
              <p>
                <span class="item-price-title">商品价格</span>
                <span class="item-price">￥{{goodsInfo.price.toFixed(2)}}</span>
              </p>
            </div>
          </div>
          <div class="item-price-right">
            <div class="item-remarks-sum">
              <p>累计评价</p>
              <p>
                <span class="item-remarks-num">{{goodsInfo.evalCont?goodsInfo.evalCont:0}} 条</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 选择颜色 -->
        <div class="item-select">
          <div class="item-select-title">
            <p>选择规格</p>
          </div>
          <div class="item-select-column">
            <div class="item-select-row" >
              <div class="item-select-box" v-for="(item, index1) in goodsInfo.specList" :key="index1" @click="select(index1)" :class="{'item-select-box-active': (index1) === selectBoxIndex}">
                <div class="item-select-img">
                  <img :src="goodsInfo.imgUrl" alt="">
                </div>
                <div class="item-select-intro">
                  <p>{{item.spec}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="add-buy-car-box">
          <div class="add-buy-car">
            <el-input-number :min="1" v-model="count" size="large"></el-input-number>
            <el-button  size="large" @click="addShoppingCartBtn()">加入购物车</el-button>
            <el-button  size="large" @click="buy()">立即购买</el-button>
          </div>
        </div>
        <div style="margin: 2px;">
          <router-link to="/goodsList1?typeId=2">
            <img height="100px" width="450" src="static/img/狗粮.jpg" />
          </router-link>
        </div>
      </div>
      <div style="margin: 30px 0px 0px 5px;height: 320px;">
        <router-link to="/goodsList1?typeId=3">
          <img style="height: 100%;width: 100%;" src="static/img/猫粮.jpg" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'ShowGoods',
  data () {
    return {
      price:0,
      count: 1,
      selectBoxIndex: -1,
      imgIndex: 0
    };
  },
  created() {
    //this.price=this.goodsInfo.price
  },
  computed: {
    ...mapState(['goodsInfo','userInfo']),
  },
  methods: {
    ...mapActions(['addShoppingCart','loadRecommend','setImmShoppingCart']),
    reset(){
      this.selectBoxIndex=-1
    },
    buy(){
      if(this.userInfo.id) {
        if(this.selectBoxIndex<0){
          this.$message.error("请先选择规格")
          return
        }
        const data = {
          goodsId: this.goodsInfo.id,
          goodsInfo:this.goodsInfo,
          goodsSkuId: this.goodsInfo.specList[this.selectBoxIndex].id,
          spec:this.goodsInfo.specList[this.selectBoxIndex].spec,
          price:this.goodsInfo.specList[this.selectBoxIndex].price,
          buyCont: this.count,
          userId: this.userInfo.id
        };
        this.setImmShoppingCart([data])
        this.$router.push('/immorder');
      }else{
        this.$message.error("请先登录")
      }
    },
    select (index1) {
      this.selectBoxIndex = index1
      this.price = this.goodsInfo.specList[index1].price;
      this.goodsInfo.price=this.goodsInfo.specList[index1].price;
    },
    showBigImg (index) {
      this.imgIndex = index;
    },
    addShoppingCartBtn () {
      if(this.userInfo.id) {
        if(this.selectBoxIndex<0){
          this.$message.error("请先选择规格")
          return
        }
        const data = {
          goodsId: this.goodsInfo.id,
          goodsInfo:this.goodsInfo,
          goodsSkuId: this.goodsInfo.specList[this.selectBoxIndex].id,
          spec:this.goodsInfo.specList[this.selectBoxIndex].spec,
          price:this.goodsInfo.specList[this.selectBoxIndex].price,
          buyCont: this.count,
          userId: this.userInfo.id
        };
        this.addShoppingCart(data);
        this.$router.push('/shoppingCart');
      }else{
        this.$message.error("请先登录")
      }
    }
  },
  mounted () {
    const father = this;
  },
  store
};
</script>

<style scoped>
/******************商品图片及购买详情开始******************/
.item-detail-show {
  width: 1320px;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  background-color: #fff;
}
.item-detail-left {
  width: 350px;
  margin-right: 30px;
}
.item-detail-big-img {
  width: 350px;
  height: 350px;
  box-shadow: 0px 0px 8px #e6a23c54;
  cursor: pointer;
}
.item-detail-big-img img {
  width: 100%;
}
.item-detail-img-row {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
}
.item-detail-img-small {
  width: 66px;
  height: 66px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  margin: 2px;
}
.item-detail-img-small img {
  width: 100%;
}
/*商品选购详情*/
.item-detail-right {
  display: flex;
  flex-direction: column;
}
.item-detail-title p {
  color: #666;
  font-size: 20px;
}
.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: #e4393c;
  color: #fff;
}
/*商品标签*/
.item-detail-tag {
  font-size: 12px;
  color: #e4393c;
}
/*价格详情等*/
.item-detail-price-row {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffa50082;
}
.item-price-left {
  display: flex;
  flex-direction: column;
}
.item-price-title {
  color: white;
  font-size: 14px;
  margin-right: 15px;
}
.item-price-row {
  margin: 5px 0px;
}
.item-price {
  color: #e4393c;
  font-size: 23px;
  cursor: pointer;
}
.item-price-full-cut {
  margin-right: 5px;
  padding: 3px;
  color: #e4393c;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted #e4393c;
  cursor: pointer;
}
.item-remarks-sum {
  padding-left: 8px;
  border-left: 1px solid #ccc;
}
.item-remarks-sum p {
  color: white;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
}
.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}
.item-select {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}
.item-select-title {
  color: black;
  font-size: 14px;
  margin-right: 15px;
}
.item-select-column {
  display: flex;
  flex-direction: column;
}
.item-select-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
}
.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-select-img {
  width: 36px;
}
.item-select-box {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-box:hover {
  border: 0.5px solid #e3393c;
}
.item-select-box-active {
  border: 0.5px solid #e3393c;
}
.item-select-img img {
  width: 100%;
}
.item-select-intro p {
  margin: 0px;
  padding: 5px;
}
.item-select-class {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-class:hover {
  border: 0.5px solid #e3393c;
}
.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
  border-top: 1px dotted #ccc;
}
.add-buy-car {
  margin-top: 15px;
}
/******************商品图片及购买详情结束******************/
</style>
