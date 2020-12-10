<template>
  <el-card class="eval">
    <el-form :inline="true" :model="sform" class="demo-form-inline">
      <el-form-item label="评论内容">
        <el-input v-model="sform.msg" placeholder="留言内容"></el-input>
      </el-form-item>
      <el-form-item label="商品">
        <el-select v-model="sform.goodsId" clearable filterable placeholder="请选择">
          <el-option :key="item.id" v-for="item in goodses" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <div :key="idx" v-for="(item,idx) in props.row.children">
              <div>
                <span style="margin-right: 5px;" >创建人：{{item.username}}</span>
                <span style="margin-right: 5px;">回复内容：{{item.msg}}</span>
                <span style="margin-right: 5px;">回复时间:{{getDate(item.createTime)}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="goodsInfo.title">
      </el-table-column>
      <el-table-column label="评论用户" prop="username">
      </el-table-column>
      <el-table-column label="评论内容" prop="msg">
      </el-table-column>
      <el-table-column label="评论时间" prop="createTime">
        <template slot-scope="scope">
          {{getDate(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-popover placement="top" width="160">
            <p>确认要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="del(scope.row.id)">确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference">删除</el-button>
          </el-popover>
          <el-button type="text" size="small" @click="reply(scope.row)" slot="reference">回复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :total="pager.total"></el-pagination>
    <el-dialog title="回复评论" :visible.sync="eformV" >
      <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
        <el-form-item label="回复内容">
          <el-input v-model="eform.msg" placeholder="请输入商品名称"></el-input>
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
  name: 'eval',
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
      eform:{imgUrl:""},
      eformV:false,
      delV:false,
      userInfo:{},
      goodses:[]
    }
  },
  created:function(){
    this.$http.post("/index/user/current",{}).then(r=>{
        if(r.body.success){
            this.userInfo=r.body.data
        }
    })
    this.$http.post("/api/goods/all",{}).then(r=>{
        if(r.body.success){
            this.goodses=r.body.data
        }
    })
    this.load()
  },
  methods:{
    reply(item){
      this.eform={
        parentId:item.id,
        userId:this.userInfo.id,
        createTime:new Date(),
        goodsId:item.goodsId,
        orderId:item.orderId,
        goodsName:item.goodsName,
        deled:0,
      }
      this.eformV=true
    },
    add(){
          this.eform={imgUrl:""}
          this.eformV=true
      },
      edit(id){
        this.$http.post("/api/eval/one",{id:id}).then(r=>{
          this.eform=r.body.data
          this.eformV=true
        })
      },
      del(id){
        this.$http.post("/api/eval/delete",{id:id}).then(r=>{
          this.$message({type: 'info',message: '删除成功'});
          this.load()
        })
      },
      save(){
        if(this.eform.status==undefined){
          this.eform.status=1
        }
        this.$http.post("/api/eval/save",this.eform).then(r=>{
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
    getDate(r){
      if(r){
        return moment(r).format("YYYY/MM/DD HH:mm")
      }
    },
    tile(ele,list){
      if(list&&list.length>0){
        for (let i = 0; i < list.length; i++) {
          let e=list[i]
          ele.children.push(e)
          this.tile(ele,e.children)
        }
      }
    },
    load(p){
      let param=this.sform
      if(p!==undefined){
        param.page=p
      }
      param.orderBy="createDate desc"
      this.$http.post("/api/eval/page",param).then(r=>{
        this.pager.total=r.body.data.totalElements
        let ll=r.body.data.content
        for (let i = 0; i < ll.length; i++) {
          let ele=ll[i]
          if(ele.children&&ele.children.length>0){
            for (let j = 0; j < ele.children.length; j++) {
              this.tile(ele,ele.children[j].children)
            }
          }
        }
        this.tableData=r.body.data.content
      })
    }
  }
}
</script>
