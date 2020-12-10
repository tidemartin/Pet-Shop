<template>
  <div>
    <div class="container">
      <div style="width: 240px;text-align: center;top: 23px;position: relative;">
        <img style="display: inline-block;" src="../../static/img/shopnewlogo.png" />
      </div>
      <div style="flex: 1;">
        <el-input style="border: solid 1px orange;border-radius: 5px;margin: 30px 50px 0px 10px; width: 70%;" placeholder="输入你想查找的商品" v-model="sdata" class="input-with-select">
          <el-button slot="append" @click="sreach" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      sdata:"",
      promotionTags: ['买2免1', '领200神券', '199减100', '母婴5折抢', '充100送20']
    };
  },
  props:["searchData"],
  watch:{
    searchData(v){
      this.sdata=v
    }
  },
  methods: {
    closeTags (index) {
      this.promotionTags.splice(index, 1);
    },
    selectTags (index) {
      this.sreachData = this.promotionTags[index];
    },
    sreach () {
      this.$emit("update:searchData",this.sdata)
      this.$emit("search",this.sdata)
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 15px;
  margin: 0px auto;
  margin-bottom: 15px;
  width: 1320px;
  display: flex;
}
.container .sreach {
  margin: 5px 0px;
}
.container input:focus{
  border-color: orange;
}
</style>
