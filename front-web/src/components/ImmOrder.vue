<template>
  <div>
    <div class="goods-list-container">
      <Alert show-icon class="tips-box">
        小提示
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">请点击商品前的选择框，选择购物车中的商品，点击付款即可。</template>
      </Alert>
      <el-table  @selection-change="select" ref="selection" :data="immShoppingCart" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.goodsInfo.imgUrl" width="80" />
          </template>
        </el-table-column>
        <el-table-column prop="goodsInfo.title" label="商品名称" >
          <template slot-scope="scope">
            <router-link :to="'/goodsDetail?goodsId='+scope.row.goodsId">{{scope.row.goodsInfo.title}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" >
        </el-table-column>
        <el-table-column prop="buyCont" label="数量" >
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.buyCont" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" >
        </el-table-column>
        <el-table-column prop="amount" label="总价" >
          <template slot-scope="scope">
            {{(scope.row.price*scope.row.buyCont).toFixed(2)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="address-container">
        <h3>收货人信息</h3>
        <div class="address-box">
          <div class="address-check">
            <div class="address-check-name">
              <span><Icon type="ios-checkmark-outline"></Icon> {{checkAddress.name}}</span>
            </div>
            <div class="address-detail" style="flex: 1;">
              <p>{{checkAddress.address}}</p>
            </div>
            <div style="float: right;">
              <el-button size="small" @click="edit">新增收货地址</el-button>
            </div>
          </div>
          <Collapse>
            <Panel>
                选择地址
                <p slot="content">
                  <RadioGroup vertical size="large" @on-change="changeAddress">
                    <Radio :label="item.id" v-for="(item, index) in address" :key="index">
                      <span>{{item.name}} {{item.address}} {{item.phone}}</span>
                    </Radio>
                  </RadioGroup>
                </p>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div class="pay-container">
        <div class="pay-box">
          <p><span>提交订单应付总额：</span> <span class="money"><Icon type="social-yen"></Icon> {{totalPrice.toFixed(2)}}</span></p>
          <div class="pay-btn">
            <Button @click="showPay"  size="large">支付订单</Button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="支付" :visible.sync="payV" width="30%" >
      <el-input v-model="psd" type="password" placeholder="请输入支付密码"></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="noPay">暂不支付</el-button>
      <el-button type="primary" @click="pay">立即支付</el-button>
    </span>
    </el-dialog>
    <Modal v-model="modal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>新增地址</span>
      </p>
      <div>
        <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
          <FormItem label="收件人" prop="name">
            <i-input v-model="formData.name" size="large"></i-input>
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <i-input v-model="formData.address" size="large"></i-input>
          </FormItem>
          <FormItem label="手机号码" prop="phone">
            <i-input v-model="formData.phone" size="large"></i-input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="large" long @click="editAction">确定</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Search from '@/components/Search';
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Order',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.loadAddress({userId:this.userInfo.id});
  },
  data () {
    return {
      goodsCheckList: [],
      checkAddress: {
        name: '未选择',
        address: '请选择地址'
      },
      psd:"",
      remarks: '',
      payV:false,
      modal: false,
      formData: {
        name: '',
        address: '',
        phone: '',
      },
      ruleInline: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapState(['address', 'immShoppingCart','userInfo']),
    totalPrice () {
      let price = 0;
      this.goodsCheckList.forEach(item => {
        price += item.price * item.buyCont;
      });
      return price;
    }
  },
  methods: {
    ...mapActions(['loadAddress']),
    select (selection, row) {
      console.log(selection);
      this.goodsCheckList = selection;
    },
    changeAddress (data) {
      const father = this;
      this.address.forEach(item => {
        if (item.id === data) {
          father.checkAddress.id=item.id
          father.checkAddress.name = item.name;
          father.checkAddress.phone=item.phone
          father.checkAddress.address = `${item.address} ${item.phone}`;
        }
      });
    },
    showPay(){
      if(this.goodsCheckList.length==0){
        this.$message.info("请选择要购买的商品")
        return
      }
      if(!this.checkAddress.id){
        this.$message.info("请选择收货地址")
        return
      }
      this.payV=true
    },
    buildOrder(){
      let d={
        orderNo:new Date().getTime(),
        userId:this.userInfo.id,
        amount:this.totalPrice,
        address:this.checkAddress.address,
        status:0,
        remark:this.remark,
        orderItem:[]
      }
      this.goodsCheckList.forEach(r=>{
        let item={
          carId:r.id,
          goodsId:r.goodsId,
          goodsSkuId:r.goodsSkuId,
          goodsName:r.goodsInfo.title,
          goodsImgUrl:r.goodsInfo.imgUrl,
          goodsSpec:r.spec,
          goodsPrice:r.price,
          cont:r.buyCont,
          amount:r.price*r.buyCont
        }
        d.orderItem.push(item)
      })
      return d
    },
    pay(){
      let d=this.buildOrder()
      d.status=1
      this.axios.post("/api/order/pay",d).then(r=>{
          if(r.data.success){
            this.$message.info(r.data.msg)
            this.$router.push("/home/myOrder")
          }else{
            this.$message.info(r.data.msg)
          }
      })
    },
    noPay(){
      if(this.goodsCheckList.length==0){
        this.$message.info("请选择要购买的商品")
        return
      }
      if(!this.checkAddress.id){
        this.$message.info("请选择收货地址")
        return
      }
      let d=this.buildOrder()
      d.status=0
      this.axios.post("/api/order/nopay",d).then(r=>{
        if(r.data.success){
          this.$router.push("/home/myOrder")
        }else{
          this.$message.info(r.data.msg)
        }
      })
    },
    edit (data) {
      this.modal = true;
      this.formData = Object.assign({});
    },
    editAction () {
      this.modal = false;
      this.formData.userId=this.userInfo.id
      this.axios.post("/api/useraddress/save",this.formData).then(r=>{
        if(r.data.success){
          this.loadAddress({userId:this.userInfo.id})
          this.$message.success('成功');
        }
      })

    },
  },
  mounted () {
    this.$refs.selection.toggleAllSelection()
  },
  components: {
    Search,
  },
  store
};
</script>

<style scoped>
.goods-list-container {
  margin: 15px auto;
  width: 1320px;
}
.tips-box {
  margin-bottom: 15px;
}
.address-container {
  margin-top: 15px;
}
.address-box {
  margin-top: 15px;
  padding: 15px;
  border: 1px #ccc dotted;
}
.address-check {
  margin: 15px 0px;
  height: 36px;
  display: flex;
  align-items: center;
}
.address-check-name {
  width: 120px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #ccc;
}
.address-check-name span {
  width: 120px;
  height: 36px;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  background-color: #f90013;
}
.address-detail {
  padding-left: 15px;
  font-size: 14px;
  color: gray;
}
.remarks-container {
  margin: 15px 0px;
}
.remarks-input {
  margin-top: 15px;
}
.invoices-container p{
  font-size: 12px;
  line-height: 30px;
  color: #999;
}
.pay-container {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
.pay-box {
  font-size: 18px;
  font-weight: bolder;
  color: #495060;
}
.money {
  font-size: 26px;
  color: #f90013;
}
.pay-btn {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
