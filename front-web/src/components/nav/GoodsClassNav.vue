
<template>
  <div class="item-class-show">
    <Row class="item-class-group" style="display: flex;">
      <i-col class="item-class-name" span="3">品牌 : </i-col>
      <i-col class="item-class-select" span="21">
        <a href="#" @click="itemClick(item,'brand')" v-for="(item, subIndex) in brands" :key="subIndex">
        <span  >{{ item.name }}</span>
        </a>
      </i-col>
    </Row>
    <!--<Row v-if="showType" class="item-class-group"  style="display: flex;">
      <i-col class="item-class-name" span="3">分类 : </i-col>
      <i-col class="item-class-select" span="21">
        <a href="#" @click="itemClick(item,'type')" v-for="(item, subIndex) in types" :key="subIndex">
        <span>{{ item.title }}</span>
        </a>
      </i-col>
    </Row>-->
  </div>
</template>

<script>
export default {
  name: 'GoodsClassNav',
  data () {
    return {
      brands:[],
      types:[]
    };
  },
  props:{
    selectedBrand:Object,
    selectedType:Object,
    showType:{
      type:Boolean,
      default:true
    }
  },
  created() {
    this.axios.post("/index/brand",{}).then(r=>{
        if(r.data.success){
            this.brands=r.data.data
        }
    })
    this.axios.post("/index/type",{}).then(r=>{
        if(r.data.success){
            this.types=r.data.data
        }
    })
  },
  methods:{
    itemClick(data,type){
      this.$emit("itemClick",data,type)
    }
  }
};
</script>

<style scoped>
.item-class-show {
  margin: 15px auto;
  width: 100%;
}
.item-class-group {
  margin-top: 1px;
  border-bottom: 1px solid #ccc;
}
.item-class-group:first-child {
  border-top: 1px solid #ccc;
}
.item-class-name {
  padding-left: 15px;
  line-height: 44px;
  color: #666;
  font-weight: bold;
  background-color: #f3f3f3;
}
.item-class-name:first-child {
  line-height: 43px;
}
.item-class-select span {
  margin-left: 15px;
  width: 160px;
  color: #005aa0;
  line-height: 45px;
  cursor: pointer;
}
</style>
