<template>
  <el-card class="users">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="sform.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="sform.type" placeholder="类型" clearable>
          <el-option label="管理员" value="1"></el-option>
          <el-option label="用户" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column label="用户名" prop="username">
      </el-table-column>
      <el-table-column label="真实姓名" prop="realname">
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday">
         <template slot-scope="scope">
          {{ getDate(scope.row.birthday)}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone">
      </el-table-column>
      <el-table-column label="类型" prop="type">
        <template slot-scope="scope">
          {{ getType(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
         <template slot-scope="scope">
          {{ getStatus(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-button style="margin-right: 10px;" type="text" @click="edit(scope.row.id)" size="small">编辑</el-button>
          <el-popover placement="top" width="160">
            <p>确认要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="del(scope.row.id)">确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :total="pager.total"></el-pagination>
    <el-dialog title="用户" :visible.sync="eformV" >
       <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
          <el-form-item label="用户名">
            <el-input v-model="eform.username" placeholder="请输入名称"></el-input>
          </el-form-item>
           <el-form-item label="密码" v-if="!eform.id" prop="password">
               <el-input type="password" required v-model="eform.password" placeholder="请输入密码"></el-input>
           </el-form-item>
           <el-form-item label="确认密码" v-if="!eform.id" prop="password2">
               <el-input type="password" required v-model="eform.password2" placeholder="请再次输入密码"></el-input>
           </el-form-item>
          <el-form-item label="类型">
           <el-select v-model="eform.type" placeholder="请选择">
            <el-option key="0" label="普通用户" :value="nums[0]"></el-option>
            <el-option key="1" label="管理员" :value="nums[1]">
            </el-option>
          </el-select>
          </el-form-item>
              <el-form-item label="真实姓名">
                  <el-input v-model="eform.realname" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
              <el-form-item label="出生日期">
                  <el-date-picker v-model="eform.birthday" type="datetime" placeholder="请输入出生日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="联系电话">
                  <el-input v-model="eform.phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
          <el-form-item label="状态">
           <el-select v-model="eform.status" placeholder="请选择">
            <el-option key="0" label="正常" :value="nums[0]"></el-option>
            <el-option key="1" label="禁用" :value="nums[1]">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eformV = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'

export default {
  name: 'users',
  components: {
  },
  data:function(){
    return{
      nums:[0,1,2,3],
      sform:{},
      tableData:[],
      pager:{
        total:0
      },
      eform:{},
      eformV:false,
      delV:false,
    }
  },
  created:function(){
    this.load()
  },
  methods:{
    add(){
          this.eform={imgUrl:""}
          this.eformV=true
      },
      edit(id){
        this.$http.post("/api/user/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
        })
      },
      del(id){
        this.$http.post("/api/user/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        if(this.eform.status==undefined){
          this.eform.status=0
        }
        if(this.eform.id){
            this.$http.post("/api/user/save",this.eform).then(r=>{
                this.$message({type: 'info',message: '保存成功'});
                this.eformV=false
                this.load()
            })
        }else{
            this.$http.post("/index/register",this.eform).then(r=>{
                this.$message({type: 'info',message: '保存成功'});
                this.eformV=false
                this.load()
            })
        }
      },
    getStatus(r){
      if(r==0){
        return '正常'
      }
      if(r==1){
        return '禁用'
      }
      return r
    },
    getType(r){
      if(r==0){
        return '普通用户'
      }
      if(r==1){
        return '管理员'
      }
      return r
    },
    getDate(r){
        if(r) {
            return moment(r).format('YYYY/MM/DD')
        }
        return ""
    },
    search(){
      this.load(0)
    },
    pageChange(r){
      this.load(r)
    },
    load(p){
      let param=this.sform
      if(!p){
        p=0
      }
      this.$http.post(`/api/user/page?page=${p}`,param).then(r=>{
        this.pager.total=r.body.data.totalElements
        this.tableData=r.body.data.content
      })
    }
  }
}
</script>
