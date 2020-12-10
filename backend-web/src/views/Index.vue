<template>
  <el-card class="index">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" style="margin:10px;">
          <div slot="header" class="clearfix">
            <span>近七天订单量</span>
            <el-button style="float: right; padding: 3px 0" @click="showDetailClick('order')" type="text">查看详情</el-button>
          </div>
          <chart style="margin:0px;padding:0px;" ref="chart1" :options="orderOpt" auto-resize="true"></chart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" style="margin:10px;">
          <div slot="header" class="clearfix">
            <span>近七天网站访问量</span>
          </div>
          <chart style="margin:0px;padding:0px;" ref="chart2" :options="goodsOpt" auto-resize="true"></chart>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" style="margin:10px;">
          <div slot="header" class="clearfix">
            <span>近七天成交金额</span>
            <el-button style="float: right; padding: 3px 0" @click="showDetailClick('order')" type="text">查看详情</el-button>
          </div>
          <chart style="margin:0px;padding:0px;" ref="chart1" :options="jeOpt" auto-resize="true"></chart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" style="margin:10px;">
          <div slot="header" class="clearfix">
            <span>近七天用户注册数量</span>
            <el-button style="float: right; padding: 3px 0" @click="showDetailClick('user')" type="text">查看详情</el-button>
          </div>
          <chart style="margin:0px;padding:0px;" ref="chart2" :options="userOpt" auto-resize="true"></chart>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>

export default {
  name: 'index',
  components: {
  },
  data:function(){
    return {
      orderOpt:{},
      goodsOpt:{},
      jeOpt:{},
      userOpt:{}
    }
  },mounted(){
    this.$http.post("/api/order/je/stat").then(r=>{
      if(r.body.success){
        this.jeOpt= {
          xAxis: {
            type: 'category',
            data: r.body.data.dates
          },
          yAxis: {
            splitNumber:1,
            type: 'value'
          },
          series: [{
            data: r.body.data.datas,
            type: 'line'
          }]
        }
      }
    })
    this.$http.post("/api/user/stat").then(r=>{
      if(r.body.success){
        this.userOpt= {
          xAxis: {
            type: 'category',
            data: r.body.data.dates
          },
          yAxis: {
            splitNumber:1,
            type: 'value'
          },
          series: [{
            data: r.body.data.datas,
            type: 'line'
          }]
        }
      }
    })
   this.$http.post("/api/order/stat").then(r=>{
     if(r.body.success){
       this.orderOpt= {
                xAxis: {
                    type: 'category',
                    data: r.body.data.dates
                },
                yAxis: {
                    splitNumber:1,
                    type: 'value'
                },
                series: [{
                    data: r.body.data.datas,
                    type: 'line'
                }]
            }
     }
   })
   this.$http.post("/api/goodsviewlog/stat").then(r=>{
     if(r.body.success){
       this.goodsOpt= {
                xAxis: {
                    type: 'category',
                    data: r.body.data.dates
                },
                yAxis: {
                    splitNumber:1,
                    type: 'value'
                },
                series: [{
                    data: r.body.data.datas,
                    type: 'line'
                }]
            }
     }
   })
  },
  methods:{
    showDetailClick(v){
      window._home.handleLeftMenuSelect(v)
    }
  }
}
</script>
<style>
.index .el-card__body{
  overflow:auto;
}
</style>
