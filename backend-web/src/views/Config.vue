<template>
  <el-card class="configs">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="配置名称">
        <el-input v-model="sform.name" placeholder="配置名称"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="sform.slot" placeholder="类型" clearable>
          <el-option label="轮播图" value="idx_lb"></el-option>
          <el-option label="分类" value="idx_type"></el-option>
          <el-option label="品牌" value="idx_brand"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column label="配置名称" prop="name">
      </el-table-column>
      <el-table-column label="类型" prop="slot">
        <template slot-scope="scope">
          {{ getSlotName(scope.row.slot)}}
        </template>
      </el-table-column>
      <el-table-column label="数据" prop="data">
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
    <el-dialog title="配置设置" :visible.sync="eformV" >
      <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
        <el-form-item label="名称">
          <el-input v-model="eform.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="eform.slot" placeholder="类型" clearable>
            <el-option label="轮播图" value="idx_lb"></el-option>
            <el-option label="分类" value="idx_type"></el-option>
            <el-option label="品牌" value="idx_brand"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="eform.slot=='idx_lb'" label="图像">
          <el-upload class="avatar-uploader" action="/api/upload/upload" :show-file-list="false"
                     :on-success="handleUploadSuccess">
            <img width="150" height="150" v-if="eform.data" :src="eform.data" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="eform.slot=='idx_lb'" label="跳转地址">
          <el-input v-model="eform.data1" placeholder="轮播图跳转地址"></el-input>
        </el-form-item>
        <el-form-item v-if="eform.slot=='idx_type'" label="分类">
          <el-select v-model="eform.data2" placeholder="选择分类" @change="typeChange" clearable>
            <el-option v-for="item in goodsTypes" :key="item.id" :label="item.title" :value="item.id+''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="eform.slot=='idx_brand'"  label="品牌">
          <el-select v-model="eform.data2" placeholder="选择品牌" @change="brandChange" clearable>
            <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id+''"></el-option>
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
    name: 'configs',
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
        goodsTypes:[],
        brands:[]
      }
    },
    created:function(){
      this.load()
      this.$http.post("/api/goodstype/all",{cusWhere:" parentId is null"}).then(r=>{
          if(r.body.success){
              this.goodsTypes=r.body.data
          }
      })
      this.$http.post("/api/brand/all",{}).then(r=>{
          if(r.body.success){
              this.brands=r.body.data
          }
      })
    },
    methods:{
      getSlotName(r){
        if(r=='idx_lb')
          return '轮播图'
        if(r=='idx_type')
          return '分类'
        if(r=='idx_brand')
          return '品牌'
        return ''
      },
      brandChange(){
        for (let i = 0; i < this.brands.length; i++) {
          if(this.eform.data2==this.brands[i].id){
            this.eform.data=this.brands[i].imgUrl
            this.eform.data1=this.brands[i].name
            break
          }
        }
      },
      typeChange(){
        for (let i = 0; i < this.goodsTypes.length; i++) {
          if(this.eform.data2==this.goodsTypes[i].id){
            this.eform.data=this.goodsTypes[i].imgUrl
            this.eform.data1=this.goodsTypes[i].title
            break
          }
        }
      },
      handleUploadSuccess(r){
        this.eform.data="/upload/"+r.path
      },
      add(){
        this.eform={data:""}
        this.eformV=true
      },
      edit(id){
        this.$http.post("/api/config/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
        })
      },
      del(id){
        this.$http.post("/api/config/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        this.$http.post("/api/config/save",this.eform).then(r=>{
          this.$message({type: 'info',message: '保存成功'});
          this.eformV=false
          this.load()
        })
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
          p=1
        }
        param.page=p
        this.$http.post(`/api/config/page?page=${p}`,param).then(r=>{
          this.pager.total=r.body.data.totalElements
          this.tableData=r.body.data.content
        })
      }
    }
  }
</script>
