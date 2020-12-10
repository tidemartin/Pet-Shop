var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')

module.exports = {

    buildInsert:function(entity){
        let sql=`insert into goodsType(
            title,
            imgUrl,
            parentId,
        createTime,
        updateTime,
        createBy,
        updateBy
        )values(
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
        vals.push(entity.title)
        vals.push(entity.imgUrl)
        vals.push(entity.parentId)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update goodsType set
                title = ? ,
                imgUrl = ? ,
                parentId = ? ,
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
            vals.push(entity.imgUrl)
        vals.push(entity.parentId)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from goodsType `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from goodsType `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select * from goodsType `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let sql = `select * from goodsType `
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
            if(entity.title){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` title = ?`
                vals.push(entity.title)
            }
            if(entity.imgUrl){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` imgUrl = ?`
                vals.push(entity.imgUrl)
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
                let ifinsh=r.data.length
                if(ifinsh==0){
                    callback(data)
                    return
                }
                for (let i = 0; i < data.content.length; i++) {
                    let type=data.content[i]
                    if(type.parentId){
                        _q.findList({sql:"select * from goodstype where id = ?",params:[type.parentId]},r1=>{
                            if(r1.data.length==0){
                                ifinsh--
                                if(ifinsh==0){
                                    _conn.end()
                                    callback({success:true,data})
                                }
                            }else{
                                type.parentName=r1.data[0].title
                                if(!r1.data[0].parentId){
                                    ifinsh--
                                    if(ifinsh==0){
                                        _conn.end()
                                        callback({success:true,data})
                                    }
                                }
                                _q.findList({sql:"select * from goodstype where id = ?",params:[r1.data[0].parentId]},r2=>{
                                    if(r2.data.length>0){
                                        type.parentName=r2.data[0].title+","+type.parentName
                                    }
                                    ifinsh--
                                    if(ifinsh==0){
                                        _conn.end()
                                        callback({success:true,data})
                                    }
                                })
                            }
                        })
                    }else {
                        type.parentName="无"
                        ifinsh--
                        if(ifinsh==0){
                            _conn.end()
                            callback({success:true,data})
                        }
                    }
                }
            },_conn)
        },_conn)
    },

    queryAll:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        _q.findList(sql,r=>{
            callback(r)
        })
    },

    getChildren(roots,callback){
        let finish1=roots.data.length
        let finish2=0
        if(finish1==0){
            callback(roots)
            return
        }
        for (let i = 0; i < roots.data.length; i++) {
            let type1=roots.data[i]
            let sql=`select t.id as value ,t.title as label from goodstype t where t.parentId = ${type1.value}`
            _q.findList(sql,r1=>{
                finish1--
                finish2+=r1.data.length
                if(finish1==0&&finish2==0){
                    callback(roots)
                    return
                }
                if(r1.data.length>0) {
                    type1.children = r1.data
                    for (let j = 0; j < r1.data.length; j++) {
                        let type2 = r1.data[j]
                        let sql1 = `select t.id as value ,t.title as label from goodstype t where t.parentId = ${type2.value}`
                        _q.findList(sql1, r2 => {
                            finish2--
                            if(r2.data.length>0) {
                                type2.children = r2.data
                            }
                            if (finish1 == 0 && finish2 == 0) {
                                callback(roots)
                                return
                            }
                        })
                    }
                }
            })
        }
    },

    /**
     * 查询 3级 商品类型
     * @param entity
     * @param callback
     * @param conn
     */
    cascadetype:function (entity,callback,conn) {
        let sql=`select t.id as value ,t.title as label from goodstype t where t.parentId is null`
        _q.findList(sql,r=>{
            let finish=r.data.length
            if(finish==0){
                callback(r)
                return
            }
            this.getChildren(r,callback)
        })
    },

    queryOne:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        sql.sql+=" limit 1"
        _q.findOne(sql,r=>{
            if(!r.data.parentId){
                callback(r)
                return
            }
            let type=r.data
            _q.findList({sql:"select * from goodstype where id = ?",params:[type.parentId]},r1=>{
                if(r1.data.length==0){
                    callback({success:true,data})
                }else{
                    type.parentName=r1.data[0].title
                    type.parentIdList=[r1.data[0].id]
                    if(!r1.data[0].parentId){
                        callback({success:true,data})
                        return
                    }
                    _q.findList({sql:"select * from goodstype where id = ?",params:[r1.data[0].parentId]},r2=>{
                        if(r2.data.length>0){
                            type.parentName=r2.data[0].title+","+type.parentName
                        }
                        callback({success:true,data})
                    })
                }
            })

        })
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from goodsType where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r=>{
            if(!r.data.parentId){
                callback(r)
                return
            }
            let type=r.data
            type.parentIdList=[type.parentId]
            _q.findList({sql:"select * from goodstype where id = ?",params:[type.parentId]},r1=>{
                if(r1.data.length==0){
                    callback({success:true,data})
                }else{
                    type.parentName=r1.data[0].title
                    if(!r1.data[0].parentId){
                        callback(r)
                        return
                    }
                    type.parentIdList.unshift(r1.data[0].parentId)
                    _q.findList({sql:"select * from goodstype where id = ?",params:[r1.data[0].parentId]},r2=>{
                        if(r2.data.length>0){
                            type.parentName=r2.data[0].title+","+type.parentName
                            if(r2.data[0].parentId) {
                                type.parentIdList.unshift(r2.data[0].parentId)
                            }
                        }
                        callback(r)
                    })
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
        let sqlStr="delete from goodsType where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    }

}
