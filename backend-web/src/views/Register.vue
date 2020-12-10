<template>
  <div class="register">
      <h3>注册账号</h3>
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width:800px;margin:auto;text-align:left;">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" required placeholder="请输入用户名（邮箱）"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" required v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input type="password" required v-model="form.password2" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
          <el-input v-model="form.realname" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker v-model="form.birthday" type="datetime" placeholder="请输入出生日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
       <!-- <el-form-item label="验证码" style="text-align:left;">
        <el-col :span="12" ><el-input v-model="form.varcode" placeholder="请输入验证码"></el-input></el-col>
        <el-col :span="12">
          <img style="width: 120px;height: 45px;" @click="refreshVarCode" :src="varUrl" />
        </el-col>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
        <el-button type="primary" @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'register',
  components: {
  },
  data:function(){
      return{
          form:{status:0},
          formRules:{
              username:[{required:true,message: '请输入用户名', trigger: 'blur'}],
              password:[{required:true,message:'请输入密码', trigger: 'blur'}],
              password2:[{required:true,message:'确认密码', trigger: 'blur'}],
              type:[{required:true,message:'选择类型', trigger: 'blur'}],
              phone:[{ pattern: /^1[123456789]\d{9}$/, message: '请输入正确的手机号码' }]
          }
      }
  },
  methods:{
      onCancel(){
        this.$router.push("/login")
      },
      onSubmit(){
        this.$refs['form'].validate((valid) => {
            if(valid) {
                if (this.form.password != this.form.password2) {
                    this.$message({type: 'info', message: '两次输入密码不一致'})
                    return false
                }
                this.form.type=1
                this.form.status=0
                this.$http.post('/index/register', this.form).then(r => {
                    if (r.body.success) {
                        this.$alert('注册成功！！！', '注册成功', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({path: "/"})
                            }
                        });
                    } else {
                        this.$message({type: 'info', message: r.body.msg});
                    }
                }, () => {
                    this.$message({type: 'info', message: '服务器错误'});
                })
            }else{
                return false
            }
        })
      }
  }
}
</script>
