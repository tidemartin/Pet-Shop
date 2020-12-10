<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="margin:auto;text-align:left;">
      <el-form-item label="新密码" prop="username">
        <el-input  v-model="form.password" required placeholder="请输入用户名（邮箱）"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="username">
        <el-input  v-model="form.password2" required placeholder="请输入用户名（邮箱）"></el-input>
      </el-form-item>
    </el-form>
    <span style="display: inline-block;margin-left: 50px;" class="dialog-footer">
        <el-button type="primary" @click="saveChgPwdForm">确 定</el-button>
      </span>
  </div>
</template>

<script>
  import store from '@/vuex/store';
  import { mapState, mapActions } from 'vuex';
  import Distpicker from 'v-distpicker';
  export default {
    name: 'MdyInfo',
    data () {
      return {
        modal: false,
        form:{status:0},
        formRules:{
          username:[{required:true,message: '请输入用户名', trigger: 'blur'}],
          password:[{required:true,message:'请输入密码', trigger: 'blur'}],
          password2:[{required:true,message:'确认密码', trigger: 'blur'}],
          type:[{required:true,message:'选择类型', trigger: 'blur'}]
        }
      };
    },
    created () {
      this.axios.post("/index/user/current",{}).then(r=>{
        if(r.data.success){
          this.form=r.data.data
          this.form.password=""
        }
      })
    },
    computed: {
    },
    methods: {
      mdyInfo(){
        this.axios.post("/api/user/save",this.form).then(r=>{
          if(r.data.success){
            this.$store.commit('SET_USER_LOGIN_INFO',this.form)
            this.$message.info("修改成功")
          }
        })
      },
      saveChgPwdForm(){
        if(this.form.password&&this.form.password==this.form.password2){
          this.$http.post("/api/user/chgpwd",this.form).then((r)=>{
            this.chgPwdV=false
            this.$alert('修改成功。', '修改成功', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          })
        }else{
          this.$message({type: 'info',message: "两次输入密码不一致"});
        }
      },
    },
    components: {
    },
    store
  };
</script>

<style scoped>
  .address-box {
    padding: 15px;
    margin: 15px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #ccc;
  }
  .address-header {
    height: 35px;
    display: flex;
    justify-content: space-between;
    color: #232323;
    font-size: 18px;
  }
  .address-content {
    font-size: 14px;
  }
  .address-content-title {
    color: #999;
  }
  .address-action span{
    margin-left: 15px;
    font-size: 14px;
    color: #2d8cf0;
    cursor: pointer;
  }
</style>
