<template>
  <div class="container">
    <Layout class="layout">
      <Sider class="side-bar" :style="{height: 'calc(100vh - 35px)', background: '#fff', overflow: 'auto'}" ref="side" :collapsed-width="78">
        <Menu active-name="1-2" theme="light" width="auto" @on-select="onSelect">
          <div class="user-icon">
            <p style="width: 100%;margin: 0px 0px 5px 40px;font-size: 18px;">
              <a href="#" style="color: blue;" @click="showMdyInfo">
                用户：{{userInfo.username}}
              </a>
            </p>
            <p style="width: 100%;margin: 0px 0px 0px 40px;">余额：{{userInfo.ye}}元</p>
            <p style="width: 100%;margin: 0px 0px 0px 40px;">
              <el-button size="mini" @click="recharge">充值</el-button>
            </p>

          </div>
          <Submenu name="1">
            <template slot="title">
                <Icon type="location"></Icon>
                <span>收货地址</span>
            </template>
            <MenuItem name="myAddress">我的收货地址</MenuItem>
            <MenuItem name="addAddress">添加收货地址</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
                <Icon type="clipboard"></Icon>
                <span>购物订单</span>
            </template>
            <MenuItem name="myOrder">我的订单</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
                <Icon type="ios-cart"></Icon>
                <span>购物车</span>
            </template>
            <MenuItem name="myShoppingCart">我的购物车</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title">
              <Icon type="ios-cart"></Icon>
              <span>个人信息</span>
            </template>
            <MenuItem name="mdypwd">修改密码</MenuItem>
            <MenuItem name="mdyinfo">修改个人信息</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout class="layout">
        <Header :style="{background: '#fff'}">
          <h2>{{activeTitle}}</h2>
        </Header>
        <Content class="content">
          <transition mode="out-in">
            <router-view></router-view>
          </transition>
        </Content>
      </Layout>
    </Layout>
    <el-dialog title="充值" :visible.sync="chargeV"  width="50%" >
      <el-input-number  placeholder="请输入充值金额" v-model="ye" >
      </el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeV = false">取 消</el-button>
        <el-button type="primary" @click="doCharge">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改个人信息" :visible.sync="infoV"  width="50%" >
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="margin:auto;text-align:left;">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="form.username" required placeholder="请输入用户名（邮箱）"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realname" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birthday" type="datetime" placeholder="请输入出生日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="infoV = false">取 消</el-button>
        <el-button type="primary" @click="mdyInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
import store from '@/vuex/store';
export default {
  name: 'Home',
  data () {
    return {
      activeTitle: '',
      chargeV:false,
      ye:0,
      bar: {
        'myAddress': '我的收货地址',
        'addAddress': '添加收货地址',
        'myOrder': '我的订单',
        'myShoppingCart': '我的购物车'
      },
      infoV:false,
      form:{status:0},
      formRules:{
        username:[{required:true,message: '请输入用户名', trigger: 'blur'}],
        password:[{required:true,message:'请输入密码', trigger: 'blur'}],
        password2:[{required:true,message:'确认密码', trigger: 'blur'}],
        type:[{required:true,message:'选择类型', trigger: 'blur'}]
      }
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['SET_USER_LOGIN_INFO']),
    onSelect (name) {
      this.activeTitle = this.bar[name];
      this.$router.push(`/home/${name}`);
    },
    recharge(){
      this.chargeV=true
      this.ye=0
    },
    doCharge(){
      let u=Object.assign({},this.userInfo)
      u.ye+=this.ye
      this.axios.post("/api/user/save",u).then(r=>{
          if(r.data.success){
              this.$store.commit('SET_USER_LOGIN_INFO', u);
          }
          this.$message.info("充值成功")
          this.chargeV=false
      })
    },
    showMdyInfo(){
      this.infoV=true
      this.form=Object.assign({},this.userInfo)
    },
    mdyInfo(){
      this.axios.post("/api/user/save",this.form).then(r=>{
          if(r.data.success){
              this.$store.commit('SET_USER_LOGIN_INFO',this.form)
              this.$message.info("修改成功")
          }
          this.infoV=false
      })
    }
  },
  store
};
</script>

<style scoped>
.side-bar a{
  color: #232323;
}
.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-icon span {
  font-size: 96px;
}
.user-img {
  margin-bottom: 15px;
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}
.user-img img{
  width: 100%;
}
.content {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
}
.layout-footer-center {
  padding: 0px 15px;
  padding-bottom: 15px;
  text-align: center;
}
</style>
