<template>
  <el-card class="goods-type">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="sform.name" placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column label="名称" prop="name">
      </el-table-column>
      <el-table-column label="图片" prop="imgUrl">
        <template slot-scope="scope">
          <img width="80" height="80" :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-button style="margin-right: 10px;" type="text" @click="edit(scope.row.id)" size="small">编辑</el-button>
          <el-popover placement="top" width="160" >
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
    <el-dialog title="商品品牌" :visible.sync="eformV" >
       <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
          <el-form-item label="品牌名称">
            <el-input v-model="eform.name" placeholder="请输入品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="图像">
            <el-upload class="avatar-uploader" action="/api/upload/upload" :show-file-list="false"
            :on-success="handleUploadSuccess">
            <img width="150" height="150" v-if="eform.imgUrl" :src="eform.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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

export default {
  name: 'brand',
  components: {
  },
  data:function(){
    return{
      sform:{},
      eform:{imgUrl:""},
      eformV:false,
      tableData:[],
      delV:false,
      pager:{
        total:0
      }
    }
  },
  created:function(){
    this.load()
  },
  methods:{
      handleUploadSuccess(r){
        this.eform.imgUrl="/upload/"+r.path
      },
      add(){
          this.eform={imgUrl:""}
          this.eformV=true
      },
      edit(id){
        this.$http.post("/api/brand/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
        })
      },
      del(id){
        this.$http.post("/api/brand/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        this.$http.post("/api/brand/save",this.eform).then(r=>{
           this.$message({type: 'info',message: '保存成功'});
           this.eformV=false
           this.load()
        })
      },
    getStatus(r){
      return r
    },
    search(){
      this.load(0)
    },
    pageChange(r){
      this.load(r)
    },
    load(p){
      let param=this.sform
      if(p!==undefined){
        param.page=p
      }
      this.$http.post("/api/brand/page",param).then(r=>{
        this.pager.total=r.body.data.totalElements
        this.tableData=r.body.data.content
      })
    }
  }
}
</script>
