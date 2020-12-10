<template>
  <div>
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
          <el-option label="已取消" :value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="orders"  style="width: 100%">
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
      <el-table-column label="总价(元)" prop="status">
        <template slot-scope="scope">
          {{ scope.row.amount.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status==0" placement="top" width="160">
            <p>确认支付吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="pay(scope.row,1)">确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference">支付</el-button>
          </el-popover>
          <el-popover v-if="scope.row.status==0" placement="top" width="160">
            <p>确认取消吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="del(scope.row)">确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference">取消订单</el-button>
          </el-popover>
            <el-popover v-if="scope.row.status==2" placement="top" width="160">
              <p>确认收货吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="primary" size="mini" @click="changeStatus(scope.row,3)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">确认收货</el-button>
            </el-popover>
            <el-button v-if="scope.row.status==3" type="text" size="small" @click="showEval(scope.row)">评价</el-button>
            <p v-if="scope.row.status==1">待发货</p>
            <p v-if="scope.row.status==4">已完成</p>
          <p v-if="scope.row.status==-1">已取消</p>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :total="pageInfo.total"></el-pagination>
    <el-dialog title="评价" :visible.sync="evalV" width="70%" >
      <el-form ref="form" :model="evalInfo" label-width="80px">
        <div style="border: solid 1px lightblue;border-radius: 3px;padding: 3px;" v-for="(item,i) in evalInfo.evals">
          <el-form-item label="商品">
            <el-input disabled v-model="item.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="评分">
            <el-rate v-model="item.star"></el-rate>
          </el-form-item>
          <el-form-item label="评价">
            <el-input v-model="item.msg"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="evalV = false">取 消</el-button>
        <el-button type="primary" @click="doEval">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import store from '@/vuex/store';
  import { mapState, mapActions } from 'vuex';
export default {
  name: 'MyOrder',
  data () {
    return {
      nums:[0,1,2,3,4,5,6,7,8,9,-1],
      sform:{},
      orders: [],
      evalV:false,
      evalInfo:{evals:[]},
      pageInfo:{
        page:1,
        size:10,
        total:0
      },
    };
  },
  created() {
    this.load(1)
  },
  computed: {
    ...mapState(['goodsInfo','userInfo']),
  },
  methods:{
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
      if(r) {
        return moment(r).format('YYYY/MM/DD hh:mm')
      }
      return ""
    },
    pageChange(r){
      this.pageInfo.page=r
      this.load(r)
    },
    search(){
      this.load(1)
    },
    showEval(item){
      this.evalV=true
      this.evalInfo.evals=[]
      this.evalInfo.order=item
      item.orderItem.forEach(r=>{
        this.evalInfo.evals.push({
          userId:this.userInfo.id,
          goodsId:r.goodsId,
          goodsName:r.goodsName+" "+r.goodsSpec,
          orderId:item.id,
          msg:""
        })
      })
    },
    doEval(){
      let ct=this.evalInfo.evals.length
      for (let i = 0; i < this.evalInfo.evals.length; i++) {
        let ev=this.evalInfo.evals[i]
        this.axios.post("/api/eval/save",ev).then(r=>{
          if(r.data.success){
          }
          if(--ct==0){
            this.changeStatus(this.evalInfo.order,4)
            this.evalV=false
          }
        })
      }
    },
    load(p){
      let param=this.sform
      param.userId=this.userInfo.id
      if(p!==undefined){
        param.page=p
        param.size=10
      }
      param.sort="createTime desc"
      this.axios.post("/api/order/page",param).then(r=>{
        this.pageInfo.total=r.data.data.totalElements
        this.orders=r.data.data.content
      })
    },
    pay(item){
      item.status=1
      this.axios.post("/api/order/pay",item).then(r=>{
        if(r.data.success){
          this.$message.info(r.data.msg)
          this.load(1)
        }else{
          this.$message.info(r.data.msg)
        }
      })
    },
    del(item){
      item.status=-1
      this.axios.post("/api/order/save",item).then(r=>{
          if(r.data.success){
              this.$message.info("已取消")
            this.load(1)
          }
      })
    },
    changeStatus(item,s){
      item.status=s
      this.axios.post("/api/order/save",item).then(r=>{
          if(r.data.success){
              this.$message.info("成功")
            this.load(1)
          }
      })
    }
  },
  store
};
</script>

<style scoped>
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
