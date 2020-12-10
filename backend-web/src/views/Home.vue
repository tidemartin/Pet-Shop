<template>
  <div class="home">
    <el-row style="background:#1890ff;" type="flex" class="row-bg">
      <el-col :span="6"><h3 style="text-align: left;margin: 20px;color: #FFF;">宠物用品商城后台管理系统</h3></el-col>
      <el-col :span="10"></el-col>
      <el-col :span="4">
        <h4 style="color:#FFF;font-weight: 400;">欢迎：{{user.username}}</h4>
      </el-col>
      <el-col :span="4">
        <el-menu style="border: 0px;padding-top:2px;" background-color="#1890ff" class="el-menu-head" text-color="#fff" mode="horizontal" @select="handleTopMenuSelect">
          <el-submenu index="2">
            <template slot="title">我的信息</template>
            <el-menu-item index="1">修改个人信息</el-menu-item>
            <el-menu-item index="2">修改密码</el-menu-item>
            <el-menu-item index="3">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <div style="display:flex;width:100%;">
      <div style="width: 200px;text-align: left;background: #FFF;box-shadow: 0 1px 4px rgba(0,21,41,.08);">
        <el-menu default-active="home" class="el-menu-vertical-demo" @select="handleLeftMenuSelect" text-color="#000" active-text-color="#1890ff">
          <el-menu-item index="home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="order">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
           <el-submenu index="sp">
              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>
                <el-menu-item index="goods">商品管理</el-menu-item>
                <el-menu-item index="goodsType">商品分类</el-menu-item>
             <el-menu-item index="brand">商品品牌</el-menu-item>
            </el-submenu>
          <el-menu-item index="eval">
            <i class="el-icon-menu"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="msg">
            <i class="el-icon-menu"></i>
            <span slot="title">留言管理</span>
          </el-menu-item>
           <el-menu-item index="user">
            <i class="el-icon-s-custom"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="config">
            <i class="el-icon-s-tools"></i>
            <span slot="title">系统配置</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="width:100%;text-align:left;">
          <div>
            <el-tabs v-model="selectedTab" @edit="handleTabsEdit" @tab-click="tabClick">
              <el-tab-pane :key="item.title" v-for="(item, index) in tabs" :closable="!index==0" :label="item.title" :name="item.title">
                <div style="width:100%;height:1px;" />
              </el-tab-pane>
            </el-tabs>
          </div>
          <router-view style="margin: 0px 5px 5px 5px;">

          </router-view>
      </div>
    </div>
    <el-dialog title="个人信息" :visible.sync="userInfoV">
      <el-form ref="userInfoForm" :model="userInfoForm" label-width="120px" style="margin:auto;text-align:left;">
        <el-form-item label="用户名(邮箱)">
          <el-input v-model="userInfoForm.username" required placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select required disabled v-model="userInfoForm.type" placeholder="请选择">
              <el-option label="管理员" :value="nums[1]">管理员</el-option>
              <el-option label="普通用户" :value="nums[0]">普通用户</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名">
            <el-input v-model="userInfoForm.realname" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="userInfoForm.birthday" type="datetime" placeholder="请输入出生日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="userInfoForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <!-- <el-form-item label="验证码" style="text-align:left;">
          <el-col :span="12" ><el-input v-model="form.varcode" placeholder="请输入验证码"></el-input></el-col>
          <el-col :span="12">
            <img style="width: 120px;height: 45px;" @click="refreshVarCode" :src="varUrl" />
          </el-col>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="saveUserInfoForm">确定</el-button>
          <el-button type="primary" @click="userInfoV=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="chgPwdV">
      <el-form ref="chgPwdForm" :model="chgPwdForm" label-width="120px" style="margin:auto;text-align:left;">
        <el-form-item label="新密码">
          <el-input v-model="chgPwdForm.password" type="password" required placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="chgPwdForm.password2" type="password" required placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveChgPwdForm">确定</el-button>
          <el-button type="primary" @click="chgPwdV=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
  },
  data:function(){
    return {
      nums:[0,1,2,3],
      user:{},
      tabs:[{title:'首页',url:'/home/index'}],
      userInfoV:false,
      chgPwdV:false,
      userInfoForm:{},
      chgPwdForm:{},
      selectedTab:""
    }
  },
  created:function(){
    window._home=this
    this.$http.post("/index/user/current").then((u)=>{
        this.user=u.body.data
    })
    this.selectedTab=this.tabs[0].title
  },
  methods:{
    handleTopMenuSelect(r){
      if(r==1){
        this.openUserInfoForm()
      }
      if(r==2){
        this.openChgPwdForm()
      }
      if(r==3){
        this.logout()
      }
    },
    tabClick(r,e){
      let t={}
      for(let i=0;i<this.tabs.length;i++){
        if(this.tabs[i].title==this.selectedTab){
          t=this.tabs[i]
          break
        }
      }
      this.selectTab(t)
    },
    /* 选择并转到标签 */
    selectTab(r){
      let find=false
      for(let i=0;i<this.tabs.length;i++){
        if(this.tabs[i].title==r.title){
          find=true
          this.selectedTab=this.tabs[i].title
          break
        }
      }
      if(!find){
        this.tabs.push(r)
        this.selectedTab=r.title
      }
      this.$router.push(r.url).catch((e)=>{
        console.info(e)
      })
    },
    handleLeftMenuSelect(r){
      if(r=='home'){
         this.selectTab({title:"首页",url:'index'})
      }
      if(r=='order'){
        this.selectTab({title:"订单管理",url:'order'})
      }
      if(r=='goods'){
        this.selectTab({title:"商品管理",url:'goods'})
      }
      if(r=='goodsType'){
        this.selectTab({title:"商品分类",url:'goodsType'})
      }
      if(r=='brand'){
        this.selectTab({title:"商品品牌",url:'brand'})
      }
      if(r=='eval'){
        this.selectTab({title:"评论管理",url:'eval'})
      }
      if(r=='msg'){
        this.selectTab({title:"留言管理",url:'msg'})
      }
      if(r=='user'){
        this.selectTab({title:"用户管理",url:'users'})
      }
      if(r=='config'){
        this.selectTab({title:"系统配置",url:'config'})
      }
    },
    handleTabsEdit(r){
      let idx=1;
      for(let i=0;i<this.tabs.length;i++){
        if(r==this.tabs[i].title){
          idx=i;
        }
      }
      this.tabs.splice(idx,1)
      if(this.selectedTab==r){
            this.selectTab(this.tabs[idx-1])
      }
    },
    openUserInfoForm(){
      this.$http.post("/index/user/current").then((r)=>{
        this.userInfoForm=r.body.data
        this.userInfoV=true
      })
    },
    saveUserInfoForm(){
      this.$http.post("/api/user/save",this.userInfoForm).then((r)=>{
        this.$message({type: 'info',message: "修改成功"});
        this.userInfoV.close()
      })
    },
    openChgPwdForm(){
      this.$http.post("/index/user/current").then((r)=>{
        this.chgPwdForm=r.body.data
        this.chgPwdForm.password=""
        this.chgPwdV=true
      })
    },
    saveChgPwdForm(){
      if(this.chgPwdForm.password&&this.chgPwdForm.password==this.chgPwdForm.password2){
        this.$http.post("/api/user/chgpwd",this.chgPwdForm).then((r)=>{
          this.chgPwdV=false
          this.$alert('修改成功，请重新登录。', '修改成功', {
                        confirmButtonText: '确定',
                        callback: action => {
                            window.location.href="/"
                        }
                    });
        })
      }else{
        this.$message({type: 'info',message: "两次输入密码不一致"});
      }
    },
    logout(){
      this.$http.post("/front/logout").then((r)=>{
        window.location.href="/"
      }).catch(r=>{
         window.location.href="/"
      })

    }
  }
}
</script>
<style>
  .home{
    margin: 0px;
  }
  .el-menu-head .el-submenu__title{
    color: #FFF;
  }
  .el-menu-head .el-submenu__title i{
    color: wheat;
  }
  .el-tabs__header{
    background: #FFF;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.08);
  }
  .el-tabs__item {
    width: 100px;
    text-align: center;
  }
</style>
