<template>
  <el-card class="goods-type">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="sform.title" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column label="名称" prop="title">
      </el-table-column>
      <el-table-column label="上级分类" prop="imgUrl">
        <template slot-scope="scope">
          {{scope.row.parentName}}
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
    <el-dialog title="商品分类" :visible.sync="eformV" >
       <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
          <el-form-item label="分类名称">
            <el-input v-model="eform.title" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="上级分类">
            <el-cascader v-model="eform.parentIdList" :props="{ checkStrictly: true }" clearable :options="cascadeTypes" ></el-cascader>
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
  name: 'goodsType',
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
      },
      cascadeTypes:[]
    }
  },
  created:function(){
    this.load()

  },
  methods:{
      handleUploadSuccess(r){
        this.eform.imgUrl="/upload/"+r.path
      },
      getCascade(){
        this.$http.post("/api/goodsType/cascadetype",{}).then(r=>{
          if(r.body.success){
            this.cascadeTypes=r.body.data
              for (let i = 0; i < this.cascadeTypes.length; i++) {
                let type1=this.cascadeTypes[i]
                if(type1.value==this.eform.id){
                  type1.disabled=true
                }
                if(type1.children&&type1.children.length>0){
                  for (let j = 0; j < type1.children.length; j++) {
                    let type2=type1.children[j]
                    if(type2.value==this.eform.id){
                      type2.disabled=true
                    }
                    type2.children =undefined
                    //if(type2.children&&type2.children.length>0){
                    //  for (let k = 0; k < type2.children.length; k++) {
                    //    let type3=type2.children[k]
                    //      type3.disabled=true
                    //  }
                    //}
                }
              }
            }
          }
        })
      },
      add(){
          this.eform={imgUrl:""}
          this.eformV=true
        this.getCascade()
      },
      edit(id){
        this.$http.post("/api/goodstype/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
          this.getCascade()
        })
      },
      del(id){
        this.$http.post("/api/goodstype/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        this.eform.parentId=this.eform.parentIdList[this.eform.parentIdList.length-1]
        this.$http.post("/api/goodstype/save",this.eform).then(r=>{
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
      this.$http.post("/api/goodstype/page",param).then(r=>{
        this.pager.total=r.body.data.totalElements
        this.tableData=r.body.data.content
      })
    }
  }
}
</script>
