<template>
  <div>
    <Row class="container">
      <i-col span="24" class="box">
        <div class="sign-up-title">
          <h1>欢迎注册账号</h1>
          <br>
        </div>
        <div class="sing-up-step-box">
          <Steps :current="signUpStep">
              <Step title="填写注册信息" icon="person-add"></Step>
              <Step title="注册成功" icon="ios-checkmark-outline"></Step>
          </Steps>
          <div class="sign-up-box">
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </i-col>
    </Row>
    <Footer></Footer>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'SignUp',
  data () {
    return {
      index: 0
    };
  },
  computed: {
    ...mapState(['signUpStep'])
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP'])
  },
  store,
  mounted () {
    this.SET_SIGN_UP_SETP(0);
  }
};
</script>

<style scoped>
.container {
  margin: 15px auto;
  overflow: hidden;
}
.signup-img-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signup-img-box>img {
  height: 80%;
}
.sign-up-title {
  width: 430px;
  margin: 15px auto;
  height: 80px;
}
.sing-up-step-box {
  margin: 15px auto;
  padding-left: 30px;
  padding-top: 30px;
  width: 430px;
  border: 1px solid #66c9ff;
  border-radius: 10px;
}
.sign-up-box {
  margin: 30px 25px;
  width: 350px;
  display: flex;
  align-items: center;
}
</style>
