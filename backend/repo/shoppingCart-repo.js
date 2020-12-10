var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')

module.exports = {

    buildInsert:function(entity){
        let sql=`insert into shoppingCart(
            goodsId,
            goodsSkuId,
            buyCont,
            userId,
        createTime,
        updateTime,
        createBy,
        updateBy
        )values(
            ?,
            ?,
            ?,
            ?,
        ?,?,?,?)`
        let vals=[]
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
        vals.push(entity.goodsId)
        vals.push(entity.goodsSkuId)
        vals.push(entity.buyCont)
        vals.push(entity.userId)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update shoppingCart set
                goodsId = ? ,
                goodsSkuId = ?,
                buyCont = ? ,
                userId = ? ,
        updateTime = ?,
        updateBy = ?
        where id = ?`

        let vals=[]
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
            vals.push(entity.goodsId)
        vals.push(entity.goodsSkuId)
            vals.push(entity.buyCont)
            vals.push(entity.userId)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from shoppingCart `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from shoppingCart `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select * from shoppingCart `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let sql = `select * from shoppingCart `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        let page=this.buildPage(entity)
        q.sql+=page.sql
        q.params.concat(page.params)
        return q
    },
    buildWhere:function(entity,alise){
        if(!alise){
            alise=""
        }
        let sql=""
        let first=true
        let vals=[]
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
        if(entity.id){
            if(first){
                first=false
                sql=" where"
            }else{
                sql+=" and"
            }
            sql+= ` id = ?`
            vals.push(entity.id)
        }
            if(entity.goodsId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` goodsId = ?`
                vals.push(entity.goodsId)
            }
            if(entity.buyCont){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` buyCont = ?`
                vals.push(entity.buyCont)
            }
            if(entity.userId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` userId = ?`
                vals.push(entity.userId)
            }
        if(entity.cusWhere){
            if(first){
                first=false
                sql=" where"
            }else{
                sql+=" and"
            }
            sql+=" " + entity.cusWhere
        }
        return {sql,params:vals}
    },
    buildOrderBy:function(entity){

    },
    buildPage:function(entity){
        let sql=""
        if(entity.page&&entity.size){
            let p=parseInt(entity.page)
            if(p>0){
                p-=1
            }
            let poff=(p)*entity.size
            sql = " limit "+ poff+","+entity.size
        }
        return {sql,params:[]}
    },

    queryPage:function (entity,callback,conn) {
        let _conn=_c.createConnection()
        let contsql=this.buildCont(entity)
        _q.count(contsql,r=>{
            let data={totalElements:r.data}
            let listsql=this.buildPageSelect(entity)
            _q.findList(listsql,r=>{
                data.content=r.data
                let finish=data.content.length*2
                if(finish==0){
                    _conn.end()
                    callback({success:true,data})
                }
                for (let i = 0; i < data.content.length; i++) {
                    let shoppingCart=data.content[i]
                    _q.findOne(this.buildGoodsSelect()+` where c.id=${shoppingCart.goodsId}`,icallback=>{
                        shoppingCart.goodsInfo=icallback.data
                        shoppingCart.title=icallback.data.title
                        finish--
                        if(finish==0){
                            _conn.end()
                            callback({success:true,data})
                        }
                    })
                    _q.findOne(`select * from goodsSku where id=${shoppingCart.goodsSkuId}`,skuCallback=>{
                        shoppingCart.goodsSkuInfo=skuCallback.data
                        shoppingCart.spec=skuCallback.data.spec
                        shoppingCart.price=skuCallback.data.price
                        finish--
                        if(finish==0){
                            _conn.end()
                            callback({success:true,data})
                        }
                    })
                }
            },_conn)
        },_conn)
    },

    queryAll:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        _q.findList(sql,r=>{
            let finish=r.data.length*2
            if(finish==0){
                callback(r)
            }
            for (let i = 0; i < r.data.length; i++) {
                let shoppingCart=r.data[i]
                _q.findOne(this.buildGoodsSelect()+` where c.id=${shoppingCart.goodsId}`,icallback=>{
                    shoppingCart.goodsInfo=icallback.data
                    shoppingCart.title=icallback.data.title
                    finish--
                    if(finish==0){
                        callback(r)
                    }
                })
                _q.findOne(`select * from goodsSku where id=${shoppingCart.goodsSkuId}`,skuCallback=>{
                    shoppingCart.goodsSkuInfo=skuCallback.data
                    shoppingCart.spec=skuCallback.data.spec
                    shoppingCart.price=skuCallback.data.price
                    finish--
                    if(finish==0){
                        callback(r)
                    }
                })
            }
        })
    },

    queryOne:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        sql.sql+=" limit 1"
        _q.findOne(sql,r=>{
            let finish=2
            let shoppingCart=r.data
            _q.findOne(this.buildGoodsSelect()+` where c.id=${shoppingCart.goodsId}`,icallback=>{
                shoppingCart.goodsInfo=icallback.data
                shoppingCart.title=icallback.data.title
                finish--
                if(finish==0){
                    callback(r)
                }
            })
            _q.findOne(`select * from goodsSku where id=${shoppingCart.goodsSkuId}`,skuCallback=>{
                shoppingCart.goodsSkuInfo=skuCallback.data
                shoppingCart.spec=skuCallback.data.spec
                shoppingCart.price=skuCallback.data.price
                finish--
                if(finish==0){
                    callback(r)
                }
            })
        })
    },

    buildGoodsSelect(){
        let sql=`select c.*,gt.title as typeName,b.name as brandName ,gi.imgUrl as imgUrl,ge.evalCont as evalCont from Goods c
        left join (select any_value(igi.imgUrl) as imgUrl,goodsId from goodsImg igi group by igi.goodsId ) gi on gi.goodsId=c.id
        left join GoodsType gt on gt.id=c.typeId0
        left join Brand b on b.id=c.brandId
        left join (select count(e.id) as evalCont,goodsId from eval e group by e.goodsId) ge on ge.goodsId = c.id`
        return sql
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from shoppingCart where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r=>{
            let finish=2
            let shoppingCart=r.data
            _q.findOne(this.buildGoodsSelect()+` where c.id=${shoppingCart.goodsId}`,icallback=>{
                shoppingCart.goodsInfo=icallback.data
                shoppingCart.title=icallback.data.title
                finish--
                if(finish==0){
                    callback(r)
                }
            })
            _q.findOne(`select * from goodsSku where id=${shoppingCart.goodsSkuId}`,skuCallback=>{
                shoppingCart.goodsSkuInfo=skuCallback.data
                shoppingCart.spec=skuCallback.spec
                shoppingCart.price=skuCallback.price
                finish--
                if(finish==0){
                    callback(r)
                }
            })
        })
    },

    save:function (entity,callback,conn) {
        let p={}
        if(entity.id){
            p=this.buildUpdate(entity)
        }else{
            p=this.buildInsert(entity)
        }
        _q.exec(p,callback,conn)
    },

    del:function (entity,callback,conn) {
        let p=this.buildDelete(entity)
        _q.exec(p,callback,conn)
    },

    deleteById:function (entity,callback,conn) {
        let sqlStr="delete from shoppingCart where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    }

}
