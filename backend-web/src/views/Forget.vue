<template>
  <div class="forget">
     <div class="login" style="text-align:center;">
    <div>
      <h2>忘记密码</h2>
    </div>
    <el-form ref="form" :model="form" label-width="120px" style="width:600px;margin:auto;">
      <el-form-item label="用户名(邮箱)">
        <el-input v-model="form.username" placeholder="请输入邮箱进行验证"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">验证</el-button>
        <el-button type="primary" @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>

export default {
  name: 'forget',
  components: {
  },
  data:function(){
    return {
      form:{}
    }
  },
  methods:{
     onCancel(){
        this.$router.push("/login")
      },
    onSubmit(){
      if(this.form.username){
        this.$http.post('/index/sendForget',this.form).then(r=>{
                  if(r.body.success){
                      this.$alert('###', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                              this.$router.push({path:"/"})
                          }
                      });
                  }else{
                      this.$message({type: 'info',message: r.body.msg});   
                  }
              },()=>{
                  this.$message({type: 'info',message: '发送失败'});   
              })
        }
    }
  }
}
</script>
