<template>
<!-- 登录页面 -->
  <div>
    <Row class="container">
      <i-col span="24" class="login-box">
        <div style="width: 600px;" class="login-container">
          <div class="login-header">
            <p>欢迎登录</p>
          </div>
          <div class="form-box">
            <Form ref="formInline" :model="formDate" :rules="ruleInline">
              <FormItem prop="username">
                  <i-input type="text" v-model="formDate.username" clearable size="large" placeholder="用户名">
                      <i class="el-icon-user" slot="prepend"></i>
                  </i-input>
              </FormItem>
              <FormItem prop="password">
                  <i-input type="password" v-model="formDate.password" clearable size="large" placeholder="密码">
                      <i class="el-icon-lock" slot="prepend"> </i>
                  </i-input>
              </FormItem>
              <FormItem prop="vercode" style="display: flex;">
                <i-input style="width: 120px;float: left;" type="text" v-model="formDate.vercode" clearable size="large" placeholder="验证码">
                  <i class="el-icon-picture-outline" slot="prepend"> </i>
                </i-input>
                <img style="float: right;width: 120px;" :src="verUrl" @click="refreshVerCode" />
              </FormItem>
              <FormItem>
                  <Button size="large" @click="handleSubmit('formInline')" long>登录</Button>
              </FormItem>
          </Form>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'Login',
  data () {
    return {
      formDate: {
        username: '',
        password: '',
        vercode:''
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 2, message: '密码不能少于2位', trigger: 'blur' }
        ],
        vercode:[{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      verUrl:"/index/vercode?d="
    };
  },
  methods: {
    ...mapMutations(['SET_USER_LOGIN_INFO']),
    ...mapActions(['login']),
    handleSubmit (name) {
      const father = this;
      console.log(this.formDate.username);
      this.$refs[name].validate((valid) => {
        if (valid) {
          father.axios.post("/index/checkver?code="+father.formDate.vercode).then((r)=> {
            if(r.data.success) {
              father.login(father.formDate).then(result => {
                if (result.success) {
                  father.$message.success('登录成功');
                  father.$router.push('/');
                } else {
                  father.$message.error('用户名或密码错误');
                }
              });
            }else{
              father.$message.error('验证码错误');
            }
          })
        } else {
          father.$message.error('请填写正确的用户名或密码');
        }
      });
    },
    refreshVerCode(){
      this.verUrl=this.verUrl+1//new Date().getTime()
    }
  },
  store
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  height: 515px;
  background-color: #fff;
}
.login-img-box {
  height: 515px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-img-box>img {
  width: 68%;
}
.login-box {
  height: 515px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 80%;
  border: #66c9ff solid 1px;
  border-radius: 10px;
}
.login-header {
  height: 50px;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 5px;
  color: #fff;
  background-color: #66c9ff;
  border-radius: 10px 10px 0px 0px;
}
.form-box {
  width: 80%;
  margin: 30px auto;
}
</style>
