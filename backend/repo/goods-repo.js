var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')
var goodsImgRepo = require('../repo/goodsImg-repo')
var goodsSpecRepo = require('../repo/goodsSku-repo')
module.exports = {

    buildInsert:function(entity){
        let sql=`insert into goods(
            title,
            subTitle,
            price,
            cont,
            oldPrice,
            spec,
            sellCont,
            desp,
            brandId,
            typeId0,
            typeId1,
            typeId2,
            status,
        createTime,
        updateTime,
        createBy,
        updateBy
        )values(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
        ?,?,?,?,?,?)`
        let vals=[]
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
        vals.push(entity.title)
        vals.push(entity.subTitle)
        vals.push(entity.price)
        vals.push(entity.cont)
        vals.push(entity.oldPrice)
        vals.push(entity.spec)
        vals.push(entity.sellCont)
        vals.push(entity.desp)
        vals.push(entity.brandId)
        vals.push(entity.typeId0)
        vals.push(entity.typeId1)
        vals.push(entity.typeId2)
        vals.push(entity.status)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update goods set
                title = ? ,
                subTitle = ? ,
                price = ? ,
                cont = ? ,
                oldPrice = ? ,
                spec = ? ,
                sellCont = ? ,
                desp = ? ,
                brandId = ? ,
                typeId0 = ? ,
                typeId1 = ? ,
                typeId2 = ? ,
                status = ? ,
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
            vals.push(entity.title)
            vals.push(entity.subTitle)
            vals.push(entity.price)
            vals.push(entity.cont)
            vals.push(entity.oldPrice)
            vals.push(entity.spec)
            vals.push(entity.sellCont)
            vals.push(entity.desp)
            vals.push(entity.brandId)
            vals.push(entity.typeId0)
        vals.push(entity.typeId1)
        vals.push(entity.typeId2)
            vals.push(entity.status)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from goods `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from goods `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select c.*,gt.title as typeName0,gt1.title as typeName1,gt2.title as typeName2,b.name as brandName ,gi.imgUrl as imgUrl,ge.evalCont as evalCont from Goods c
         left join (select any_value(igi.imgUrl) as imgUrl,goodsId from goodsImg igi group by igi.goodsId ) gi on gi.goodsId=c.id
         left join GoodsType gt on gt.id=c.typeId0
         left join GoodsType gt1 on gt.id=c.typeId1
         left join GoodsType gt2 on gt.id=c.typeId2
         left join Brand b on b.id=c.brandId
         left join (select count(e.id) as evalCont,goodsId from eval e group by e.goodsId) ge on ge.goodsId = c.id`
        let q=this.buildWhere(entity,'c.')
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let q = this.buildSelect(entity)
        if(entity.sort){
            q.sql+=" order by "+entity.sort
        }
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
            sql+= ` ${alise}id = ?`
            vals.push(entity.id)
        }
            if(entity.title){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}title like concat('%',?,'%')`
                vals.push(entity.title)
            }
            if(entity.subTitle){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}subTitle = ?`
                vals.push(entity.subTitle)
            }
            if(entity.price){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}price = ?`
                vals.push(entity.price)
            }
            if(entity.cont){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}cont = ?`
                vals.push(entity.cont)
            }
            if(entity.oldPrice){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}oldPrice = ?`
                vals.push(entity.oldPrice)
            }
            if(entity.spec){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}spec = ?`
                vals.push(entity.spec)
            }
            if(entity.sellCont){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}sellCont = ?`
                vals.push(entity.sellCont)
            }
            if(entity.desp){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}desp = ?`
                vals.push(entity.desp)
            }
            if(entity.brandId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}brandId = ?`
                vals.push(entity.brandId)
            }
            if(entity.typeId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` (${alise}typeId0 = ? or ${alise}typeId1 = ? or ${alise}typeId2 = ?)`
                vals.push(entity.typeId)
                vals.push(entity.typeId)
                vals.push(entity.typeId)
            }
            if(entity.status){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}status = ?`
                vals.push(entity.status)
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
        }else{
            sql = " limit 10"
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
                    let goods=data.content[i]
                    if (goods.typeId2){
                        goods.typeIdList=[goods.typeId0,goods.typeId1,goods.typeId2]
                    }
                    if(goods.typeId1){
                        goods.typeIdList=[goods.typeId0,goods.typeId1]
                    }
                    if(goods.typeId0){
                        goods.typeIdList=[goods.typeId0]
                    }
                    _q.findList(`select * from goodsImg where goodsId=${goods.id}`,icallback=>{
                        goods.imgList=icallback.data
                        finish--
                        if(finish==0){
                            _conn.end()
                            callback({success:true,data})
                        }
                    })
                    _q.findList(`select * from goodsSku where goodsId=${goods.id}`,skuCallback=>{
                        goods.specList=skuCallback.data
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
                callback({success:true,data})
            }
            for (let i = 0; i < r.data.length; i++) {
                let goods=r.data[i]
                _q.findList(`select * from goodsImg where goodsId=${goods.id}`,icallback=>{
                    goods.imgList=icallback.data
                    finish--
                    if(finish==0){
                        callback(r)
                    }
                })
                _q.findList(`select * from goodsSku where goodsId=${goods.id}`,skuCallback=>{
                    goods.specList=skuCallback.data
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
            let goods=r.data
            if (goods.typeId2){
                goods.typeIdList=[goods.typeId0,goods.typeId1,goods.typeId2]
            }else if(goods.typeId1){
                goods.typeIdList=[goods.typeId0,goods.typeId1]
            }else if(goods.typeId0){
                goods.typeIdList=[goods.typeId0]
            }
            _q.findList(`select * from goodsImg where goodsId=${goods.id}`,icallback=>{
                goods.imgList=icallback.data
                finish--
                if(finish==0){
                    callback(r)
                }
            })
            _q.findList(`select * from goodsSku where goodsId=${goods.id}`,skuCallback=>{
                goods.specList=skuCallback.data
                finish--
                if(finish==0){
                    callback(r)
                }
            })
        })
    },

    findById:function (id) {
        return new Promise((rs,j)=>{
            let sqlStr="select * from goods where id = ?"
            let sql={
                sql:sqlStr,
                params:[id]
            }
            _q.findOne(sql,r=>{
                let finish=2
                let goods=r.data
                if (goods.typeId2){
                    goods.typeIdList=[goods.typeId0,goods.typeId1,goods.typeId2]
                }else if(goods.typeId1){
                    goods.typeIdList=[goods.typeId0,goods.typeId1]
                }else if(goods.typeId0){
                    goods.typeIdList=[goods.typeId0]
                }
                _q.findList(`select * from goodsImg where goodsId=${goods.id}`,icallback=>{
                    goods.imgList=icallback.data
                    finish--
                    if(finish==0){
                        rs(r)
                    }
                })
                _q.findList(`select * from goodsSku where goodsId=${goods.id}`,skuCallback=>{
                    goods.specList=skuCallback.data
                    finish--
                    if(finish==0){
                        rs(r)
                    }
                })
            })
        })
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from goods where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r=>{
            let finish=2
            let goods=r.data
            if (goods.typeId2){
                goods.typeIdList=[goods.typeId0,goods.typeId1,goods.typeId2]
            }else if(goods.typeId1){
                goods.typeIdList=[goods.typeId0,goods.typeId1]
            }else if(goods.typeId0){
                goods.typeIdList=[goods.typeId0]
            }
            _q.findList(`select * from goodsImg where goodsId=${goods.id}`,icallback=>{
                goods.imgList=icallback.data
                finish--
                if(finish==0){
                    callback(r)
                }
            })
            _q.findList(`select * from goodsSku where goodsId=${goods.id}`,skuCallback=>{
                goods.specList=skuCallback.data
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
        let finish=0
        if(entity.imgList){
            finish+=entity.imgList.length
        }
        if(entity.specList){
            finish+=entity.specList.length
        }
        var _conn=_q.connect()
        _q.exec(p,er=>{
            if(entity.id){
                _q.exec({sql: `delete from goodsImg where goodsId = ${entity.id}`, params: []}, r => {
                    if (entity.imgList) {
                        for (let i = 0; i < entity.imgList.length; i++) {
                            let img=entity.imgList[i]
                            img.goodsId=entity.id
                            img.id=null
                            goodsImgRepo.save(entity.imgList[i], r => {
                                if(--finish==0){
                                    _conn.end()
                                    callback()
                                }
                            },_conn)
                        }
                    }
                },_conn)
                _q.exec({sql: `delete from goodsSku where goodsId = ${entity.id}`, params: []}, r => {
                    if (entity.specList) {
                        for (let i = 0; i < entity.specList.length; i++) {
                            let spec=entity.specList[i]
                            spec.goodsId=entity.id
                            spec.id=null
                            goodsSpecRepo.save(entity.specList[i], r => {
                                if(--finish==0){
                                    _conn.end()
                                    callback()
                                }
                            },_conn)
                        }
                    }
                },_conn)
            }else{
                _q.findOne({sql:"select last_insert_id() as id",params:[]},r=>{
                    entity.id=r.data.id
                    _q.exec({sql: `delete from goodsImg where goodsId = ${entity.id}`, params: []}, r => {
                        if (entity.imgList) {
                            for (let i = 0; i < entity.imgList.length; i++) {
                                let img=entity.imgList[i]
                                img.goodsId=entity.id
                                img.id=null
                                goodsImgRepo.save(entity.imgList[i], r => {
                                    if(--finish==0){
                                        _conn.end()
                                        callback()
                                    }
                                },_conn)
                            }
                        }
                    },_conn)
                    _q.exec({sql: `delete from goodsSku where goodsId = ${entity.id}`, params: []}, r => {
                        if (entity.specList) {
                            for (let i = 0; i < entity.specList.length; i++) {
                                let spec=entity.specList[i]
                                spec.goodsId=entity.id
                                spec.id=null
                                goodsSpecRepo.save(entity.specList[i], r => {
                                    if(--finish==0){
                                        _conn.end()
                                        callback()
                                    }
                                },_conn)
                            }
                        }
                    },_conn)
                },_conn)
            }
        },_conn)
    },

    del:function (entity,callback,conn) {
        let p=this.buildDelete(entity)
        _q.exec(p,callback,conn)
    },

    deleteById:function (entity,callback,conn) {
        let sqlStr="delete from goods where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    },

    stat:function (d1,d2) {
        let sql=`select count(*) from goods g where g.createTime>=? and g.createTime <= ?`
        let params=[d1,d2]
        return new Promise((rs,j)=>{
            _q.exec({sql,params},r=>{
                rs(r)
            })
        })
    }

}
