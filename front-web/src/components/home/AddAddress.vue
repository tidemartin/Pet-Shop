<template>
  <div>
    <div class="add-container">
      <div class="add-title">
        <h1>添加收货地址</h1>
      </div>
      <div class="add-box">
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
      <div class="add-submit">
        <Button @click="addAddress" type="primary">添加地址</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Distpicker from 'v-distpicker';
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AddAddress',
  data () {
    return {
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
          { required: true, message: '手机号不能为空', trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    ...mapState(['address','userInfo'])
  },
  methods: {
    ...mapActions(['loadAddress','isLogin']),
    addAddress(){
      this.formData.userId=this.userInfo.id
      this.axios.post("/api/useraddress/save",this.formData).then(r=>{
          if(r.data.success){
              this.$message.info("添加收货地址成功")
          }
      })
    }
  },
  components: {
    Distpicker
  },
  store
};
</script>

<style scoped>
.add-container {
  margin: 15px auto;
  width: 60%;
  min-width: 600px;
}
.add-title {
  margin-bottom: 15px;
  text-align: center;
}
.add-submit {
  display: flex;
  justify-content: center;
}
</style>
