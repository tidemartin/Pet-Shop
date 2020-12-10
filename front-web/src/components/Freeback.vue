<template>
  <div>
    <div style="margin: 30px;">
      <h2 style="margin: 5px;">商品购买流程</h2>
      <div style="height: 400px;">
        <el-steps direction="vertical" :active="5">
          <el-step title="选择商品" description="选择您要购买的商品"></el-step>
          <el-step title="加入购物车" description="将商品加入购物车"></el-step>
          <el-step title="支付" description="购买商品并支付"></el-step>
          <el-step title="收货" ></el-step>
          <el-step title="评价" ></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Freeback',
  data () {
    return {
      formItem: {
        title: '',
        content: ''
      }
    };
  }
};
</script>

<style scoped>
.freeback-container {
  margin: 15px auto;
  width: 80%;
  height: 600px;
  display: flex;
  align-items: center;
  /* background-color: #ccc; */
}
.freeback-img-box {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.freeback-img-box img {
  width: 80%;
}
.freeback-box-border {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.freeback-box {
  width: 480px;
}
.freeback-content {
  margin: 15px auto;
  border: 1px #ccc dotted;
}
.freeback-form {
  margin: 30px auto;
  width: 90%;
}
</style>
