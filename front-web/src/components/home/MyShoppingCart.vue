<template>
  <div>
    <el-table ref="selection" :data="shoppingCart" style="width: 100%">
      <el-table-column prop="goodsInfo.title"  label="商品名称" >
      </el-table-column>
      <el-table-column prop="spec"  label="规格" >
      </el-table-column>
      <el-table-column prop="goodsInfo.price"  label="价格" >
      </el-table-column>
      <el-table-column prop="buyCont"  label="数量" >
      </el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
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
    <div class="go-to">
      <Button @click="goTo" type="primary">去付款</Button>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'MyShoppingCart',
  data () {
    return {

    };
  },
  created () {
    this.loadShoppingCart({userId:this.userInfo.id});
  },
  computed: {
    ...mapState(['shoppingCart','userInfo'])
  },
  methods: {
    ...mapActions(['loadShoppingCart']),
    goTo () {
      this.$router.push('/order');
    },
    del(id){
      this.axios.post("/api/shoppingcart/delete",{id}).then(r=>{
          if(r.data.success){
              this.loadShoppingCart({userId:this.userInfo.id});
              this.$message.info("删除成功")
          }
      })
    }
  },
  store
};
</script>

<style scoped>
.go-to {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
