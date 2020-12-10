<template>
  <div class="login" style="text-align:center;">
    <div>
      <h3>宠物用品商城系统</h3>
    </div>
    <el-form ref="form" :model="form" label-width="80px" style="width:600px;margin:auto;">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
       <el-form-item label="验证码" style="text-align:left;">
        <el-col :span="12" ><el-input v-model="form.vercode" placeholder="请输入验证码"></el-input></el-col>
        <el-col :span="12">
          <img style="width: 120px;height: 45px;" @click="refreshVerCode" :src="verUrl" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <router-link to="/register" style="margin-left:20px;">注册账号</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'login',
  components: {
  },
  data:function(){
    return{
      form:{},
      verUrl:"/index/vercode?d="
    }
  },
  created:function(){

  },
  methods:{
    onSubmit(){
      this.$http.get("/index/checkver?code="+this.form.vercode).then((r)=>{
        if(r.body.success){
          this.form.from='backend'
          this.$http.post("/index/login",this.form).then((r)=>{
            if(r.body.success){
              this.$router.push({path:"/home/index"})
            }else{
              this.$message({
              type: 'info',
              message: r.body.msg
            });
            }
          },(e)=>{
            this.$message({
              type: 'info',
              message: '用户名/密码错误'
            });
          })
        }else{
          this.$message({
            type: 'info',
            message: '验证码不正确'
          });
        }
      },(e)=>{
        this.$message({
            type: 'info',
            message: '验证码不正确'
          });
      })
    },
    refreshVerCode(){
      this.verUrl=this.verUrl+1//new Date().getTime()
    }
  }
}
</script>
