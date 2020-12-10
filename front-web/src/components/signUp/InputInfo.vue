<template>
  <div class="info-form">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
        <FormItem label="用户名" prop="name">
            <i-input v-model="formValidate.name" clearable size="large" placeholder="请输入用户名"></i-input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <i-input type="password" v-model="formValidate.password" clearable size="large" placeholder="请输入你的密码"></i-input>
        </FormItem>
        <FormItem label="确认密码" prop="repassword">
            <i-input type="password" v-model="formValidate.repassword" clearable size="large" placeholder="请再次输入你的密码"></i-input>
        </FormItem>
       <FormItem label="真实姓名">
         <i-input v-model="formValidate.realname" placeholder="请输入真实姓名"></i-input>
       </FormItem>
       <FormItem label="出生日期">
         <DatePicker v-model="formValidate.birthday" type="date" placeholder="请输入出生日期" style="width: 200px"></DatePicker>
       </FormItem>
       <FormItem label="联系电话" prop="phone">
         <i-input v-model="formValidate.phone" placeholder="请输入联系电话"></i-input>
       </FormItem>
       <FormItem prop="vercode" label="验证码" class="vercode" style="display: flex;">
         <i-input style="width: 120px;float: left;" type="text" v-model="formValidate.vercode" clearable size="large" placeholder="验证码"></i-input>
         <img style="float: right;width: 100px;" :src="verUrl" @click="refreshVerCode" />
       </FormItem>
        <Button size="large" long @click="handleSubmit('formValidate')">注册</Button>
    </Form>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations, mapActions } from 'vuex';
import Vue from "vue";
export default {
  name: 'InputInfo',
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formValidate.password) {
        callback(new Error('两次输入的密码不一样'));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        name: '',
        mail: '',
        password: '',
        repassword: '',
        vercode:''
      },
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        phone:[{ min: 11,max:11,message: '手机号码11位', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 2, message: '密码长度不能小于2', trigger: 'blur' }
        ],
        vercode:[{ required: true, message: '请输入验证码', trigger: 'blur' }],
        repassword: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      verUrl:"/index/vercode?d="
    };
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP']),
    handleSubmit (name) {
      const father = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          father.axios.post("/index/checkver?code="+father.formValidate.vercode).then((rr)=> {
            if(rr.data.success) {
              debugger
              const userinfo = {
                username: this.formValidate.name,
                password: this.formValidate.password,
                mail: this.formValidate.mail,
                phone: this.formValidate.phone,
                realname:this.formValidate.realname,
                birthday:this.formValidate.birthday,
                status:0,
                type:0,
                ye:0
              };
              this.axios.post("/index/register", userinfo).then(r => {
                if (r.data.success) {
                  father.SET_SIGN_UP_SETP(1);
                  this.$message.success('注册成功');
                  this.$router.push({ path: '/SignUp/signUpDone' });
                }else{
                  this.$message.error(r.data.msg);
                }
              })
            }else{
              father.$message.error('验证码错误');
            }
          })
        } else {
          this.$message.error('注册失败');
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

<style >
.info-form {
  width: 90% !important;
}
  .vercode .ivu-form-item-content{
    margin-left: 0px!important;
  }
</style>
