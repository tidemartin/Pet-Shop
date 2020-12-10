<template>
    <el-card class="goods">
        <el-form :inline="true" :model="sform" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="sform.title" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="sform.status" placeholder="商品状态" clearable>
                    <el-option label="未上架" :value="nums[0]"></el-option>
                    <el-option label="已上架" :value="nums[1]"></el-option>
                    <el-option label="售完" :value="nums[2]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="add()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData"  style="width: 100%">
            <el-table-column label="名称" prop="title">
            </el-table-column>
            <el-table-column label="品牌" prop="brandName">
            </el-table-column>
            <el-table-column label="均价" prop="price">
            </el-table-column>
            <el-table-column label="发布时间" prop="createTime">
                <template slot-scope="scope">
                    {{ getDate(scope.row.createTime)}}
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
        <el-dialog title="商品" :visible.sync="eformV" width="70%" >
            <el-form ref="form" :model="eform" label-width="80px" style="margin:auto;">
                <el-form-item label="商品名称">
                    <el-input v-model="eform.title" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="eform.subTitle" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader style="width: 70%;" v-model="eform.typeIdList" clearable :options="cascadeTypes" ></el-cascader>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select v-model="eform.brandId" placeholder="请选择">
                        <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload action="/api/upload/upload" list-type="picture-card" :file-list="imgList"
                               :on-preview="handleImgPreview"
                               :on-remove="handleImgRemove"
                               :on-success="handleUploadSuccess">
                        <i class="el-icon-plus"></i>
                        <div slot="tip" class="el-upload__tip">上传商品图片</div>
                    </el-upload>
                    <el-dialog :visible.sync="imgDlgV">
                        <img width="100%" :src="dlgImgUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="规格">
                    <div v-for="(item,idx) in eform.specList" style="margin: 3px;border: solid 1px lightblue;border-radius: 5px;padding: 2px;">
                        规格:
                        <el-input style="width: 100px;margin:0px 2px;" v-model="item.spec" placeholder="请输入规格"></el-input>
                        价格:
                        <el-input-number style="width: 140px;margin:0px 2px;" :min="1" v-model="item.price" placeholder="请输入价格"></el-input-number>
                        库存:
                        <el-input-number style="width: 140px;margin:0px 2px;" :min="0" v-model="item.cont" placeholder="请输入库存"></el-input-number>
                        <el-button @click="delSpec(item)">删除</el-button>
                    </div>
                    <el-button @click="addSpec()">添加</el-button>
                </el-form-item>
                <el-form-item label="均价">
                    <el-input v-model="eform.price" type="number" placeholder="请输入商品价格"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="eform.status" placeholder="请选择">
                        <el-option label="未上架" :value="nums[0]"></el-option>
                        <el-option label="已上架" :value="nums[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="eform.desp" type="textarea" placeholder="请输入商品描述"></el-input>
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
        name: 'goods',
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
                types:[],
                brands:[],
                dlgImgUrl:"",
                imgDlgV:false,
                imgList:[],
                cascadeTypes:[]
            }
        },
        created:function(){
            this.load()
            this.$http.post("/api/goodstype/all",{}).then(r=>{
                if(r.body.data){
                    this.types = r.body.data
                }
            })
            this.$http.post("/api/brand/all",{}).then(r=>{
                if(r.body.data){
                    this.brands = r.body.data
                }
            })
            this.getCascade()
        },
        methods:{
            getCascade(){
                this.$http.post("/api/goodsType/cascadetype",{}).then(r=>{
                    if(r.body.success){
                        this.cascadeTypes=r.body.data
                        for (let i = 0; i < this.cascadeTypes.length; i++) {
                            let type1=this.cascadeTypes[i]
                            if(type1.children&&type1.children.length>0){
                                for (let j = 0; j < type1.children.length; j++) {
                                    let type2=type1.children[j]
                                    if(type2.children&&type2.children.length>0){
                                      //for (let k = 0; k < type2.children.length; k++) {
                                      //  let type3=type2.children[k]
                                      //  type3.disabled=true
                                      //}
                                    }
                                }
                            }
                        }
                    }
                })
            },
            delSpec(item){
                for (let i = 0; i < this.eform.specList.length; i++) {
                    if(this.eform.specList[i]==item){
                        this.eform.specList.splice(i,1)
                        break
                    }
                }
            },
            addSpec(){
                this.eform.specList.push({})
            },
            getDate(d){
                if(d){
                    return moment(d).format("YYYY/MM/DD")
                }
                return ""
            },
            handleImgPreview(file) {
                this.dlgImgUrl = file.url;
                this.imgDlgV = true;
            },
            handleImgRemove(r){
                for(let i=0;i<this.imgList.length;i++){
                    if(r.url==this.imgList[i].url){
                        this.imgList.splice(i,1)
                        this.eform.imgList.splice(i,1)
                        break
                    }
                }
            },
            handleUploadSuccess(r){
                this.eform.imgList.push({imgUrl:"/upload/"+r.path})
            },
            add(){
                this.eform={imgList:[],specList:[]}
                this.imgList=[]
                this.eformV=true
            },
            edit(id){
                this.$http.post("/api/goods/one",{id:id}).then(r=>{
                    this.imgList=[]
                    r.body.data.imgList.forEach(r=>{
                        r.name=r.id
                        r.url=r.imgUrl
                        this.imgList.push(r)
                    })
                    this.eform=r.body.data
                    this.eformV=true
                })
            },
            del(id){
                this.$http.post("/api/goods/delete",{id:id}).then(r=>{
                    this.$message({type: 'info',message: '删除成功'});
                    this.load()
                })
            },
            save(){
                if(this.eform.status==undefined){
                    this.eform.status=1
                }
                if(!this.eform.sellCont){
                    this.eform.sellCont=0
                }
                if(this.eform.typeIdList&&this.eform.typeIdList.length>0){
                    for (let i = 0; i < this.eform.typeIdList.length; i++) {
                        this.eform['typeId'+i]=this.eform.typeIdList[i]
                    }
                }
                this.$http.post("/api/goods/save",this.eform).then(r=>{
                    this.$message({type: 'info',message: '保存成功'});
                    this.eformV=false
                    this.load()
                })
            },
            getStatus(r){
                if(r==0){
                    return '未上架'
                }
                if(r==1){
                    return '已上架'
                }
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
                this.$http.post("/api/goods/page",param).then(r=>{
                    this.pager.total=r.body.data.totalElements
                    this.tableData=r.body.data.content
                })
            }
        }
    }
</script>
