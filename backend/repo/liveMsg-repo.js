var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')

module.exports = {

    buildInsert:function(entity){
        let sql=`insert into liveMsg(
            goodsId,
            userId,
            msg,
            parentId,
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
        vals.push(entity.userId)
        vals.push(entity.msg)
        vals.push(entity.parentId)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update liveMsg set
                goodsId = ? ,
                userId = ? ,
                msg = ? ,
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
            vals.push(entity.goodsId)
            vals.push(entity.userId)
            vals.push(entity.msg)
            vals.push(entity.parentId)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from liveMsg `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from liveMsg `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select c.*,u.username as username from liveMsg c
         left join user u on u.id = c.userId`
        entity.cusWhere = ' c.parentId is null '
        let q=this.buildWhere(entity,'c.')
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let q=this.buildSelect(entity)
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
            if(entity.goodsId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}goodsId = ?`
                vals.push(entity.goodsId)
            }
            if(entity.userId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}userId = ?`
                vals.push(entity.userId)
            }
            if(entity.msg){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+=  ` ${alise}msg like concat('%',?,'%')`
                vals.push(entity.msg)
            }
            if(entity.parentId){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}parentId = ?`
                vals.push(entity.parentId)
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
        entity.cusWhere = ' parentId is null'
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
                    let eval=data.content[i]
                    _q.findOne(`select * from goods where id = ${eval.goodsId}`,gcb=>{
                        eval.goodsInfo=gcb.data
                        if(--finish==0){
                            _conn.end()
                            callback({success:true,data})
                        }
                    })
                    _q.findList(`select c.*,u.username as username from liveMsg c left join user u on u.id = c.userId where c.parentId = ${eval.id}`,gcb=>{
                        eval.children=gcb.data
                        if(--finish==0){
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
                let eval=r.data[i]
                _q.findOne(`select * from goods where id = ${eval.goodsId}`,gcb=>{
                    eval.goodsInfo=gcb.data
                    if(--finish==0){
                        callback(r)
                    }
                })
                _q.findList(`select c.*,u.username as username from liveMsg c left join user u on u.id = c.userId where c.parentId = ${eval.id}`,gcb=>{
                    eval.children=gcb.data
                    if(--finish==0){
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
            let eval = r.data
            let finish=2
            _q.findOne(`select * from goods where id = ${eval.goodsId}`, gcb => {
                eval.goodsInfo = gcb.data
                if(--finish==0){
                    callback(r)
                }
            })
            _q.findList(`select c.*,u.username as username from liveMsg c left join user u on u.id = c.userId where c.parentId = ${eval.id}`,gcb=>{
                eval.children=gcb.data
                if(--finish==0){
                    callback(r)
                }
            })
        })
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from liveMsg where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r=>{
            let eval = r.data
            let finish=2
            _q.findOne(`select * from goods where id = ${eval.goodsId}`, gcb => {
                eval.goodsInfo = gcb.data
                if(--finish==0){
                    callback(r)
                }
            })
            _q.findList(`select c.*,u.username as username from liveMsg c left join user u on u.id = c.userId where c.parentId = ${eval.id}`,gcb=>{
                eval.children=gcb.data
                if(--finish==0){
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
        let sqlStr="delete from liveMsg where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    }

}
