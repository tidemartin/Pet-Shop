<template>
  <el-card class="order">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="sform.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="sform.status" placeholder="订单状态" clearable>
            <el-option label="已评价" value="4"></el-option>
            <el-option label="已收货" value="3"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="待支付" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" :key="idx" v-for="(item,idx) in props.row.orderItem">
            <el-form-item label="商品名称:" style="font-weight:600;">
              <span style="font-weight: 500;">{{ item.goodsName }}</span>
            </el-form-item>
            <el-form-item label="价格(元):" style="font-weight:600;">
              <span style="font-weight: 500;">{{ item.goodsPrice }}</span>
            </el-form-item>
            <el-form-item label="购买数量:" style="font-weight:600;">
              <span style="font-weight: 500;">{{ item.cont }}</span>
            </el-form-item>
            <el-form-item label="总价:" style="font-weight:600;">
              <span style="font-weight: 500;">{{ item.amount }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo">
      </el-table-column>
      <el-table-column label="用户" prop="username">
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate">
          <template slot-scope="scope">
          {{ getDate(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status">
         <template slot-scope="scope">
          {{ getStatus(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-button style="margin-right: 10px;" type="text" @click="edit(scope.row.id)" size="small">修改订单状态</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :total="pager.total"></el-pagination>
    <el-dialog title="订单信息" :visible.sync="eformV" >
       <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
          <el-form-item label="订单号">
            <el-input v-model="eform.orderNo" readonly placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
           <el-select v-model="eform.status" placeholder="请选择">
             <el-option label="已取消" :value="nums[10]"></el-option>
            <el-option label="待支付" :value="nums[0]"></el-option>
              <el-option label="已支付" :value="nums[1]"></el-option>
             <el-option label="已发货" :value="nums[2]"></el-option>
                <el-option label="已收货" :value="nums[3]"></el-option>
             <el-option label="已评价" :value="nums[4]"></el-option>
          </el-select>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eformV = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'

export default {
  name: 'order',
  components: {
  },
  data:function(){
    return{
      nums:[0,1,2,3,4,5,6,7,8,9,-1],
      sform:{},
      tableData:[],
      pager:{
        total:0
      },
      eform:{},
      eformV:false
    }
  },
  created:function(){
    this.load()
  },
  methods:{
    add(){
          this.eform={imgUrl:""}
          this.eformV=true
      },
      edit(id){
        this.$http.post("/api/order/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
        })
      },
      del(id){
        this.$http.post("/api/order/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        if(this.eform.status==undefined){
          this.eform.status=1
        }
        this.$http.post("/api/order/save",this.eform).then(r=>{
           this.$message({type: 'info',message: '保存成功'});
           this.eformV=false
           this.load()
        })
      },
    getStatus(r){
      //0 待支付 1 已支付 3 已发货 4 已完成 -1 已取消
        if(r==0)return '待支付'
        if(r==1)return '已支付'
        if(r==2)return '已发货'
        if(r==3)return '已收货'
        if(r==4)return '已评价'
        if(r==-1)return '已取消'
    },
    getDate(r){
      return moment(r).format("YYYY/MM/DD hh:mm:ss")
    },
    search(){
      this.load(0)
    },
    pageChange(r){
      this.load(r)
    },
    load(p){
      let param=this.sform
      if(p!==undefined){
        param.page=p
      }
       param.orderBy="createDate desc"
      this.$http.post("/api/order/page",param).then(r=>{
        this.pager.total=r.body.data.totalElements
        this.tableData=r.body.data.content
      })
    }
  }
}
</script>
