var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')

module.exports = {

    buildInsert:function(entity){
        let sql=`insert into user(
            username,
            password,
            realname,
            sex,
            birthday,
            phone,
            ye,
            type,
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
        ?,?,?,?)`
        let vals=[]
        if(entity.birthday){
            entity.birthday=new Date(entity.birthday)
        }
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
        vals.push(entity.username)
        vals.push(entity.password)
        vals.push(entity.realname)
        vals.push(entity.sex)
        vals.push(entity.birthday)
        vals.push(entity.phone)
        vals.push(entity.ye)
        vals.push(entity.type)
        vals.push(entity.status)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update user set
                username = ? ,
                password = ? ,
                realname = ? ,
                sex = ? ,
                birthday = ? ,
                phone = ? ,
                ye = ? ,
                type = ? ,
                status = ? ,
        updateTime = ?,
        updateBy = ?
        where id = ?`

        let vals=[]
                if(entity.birthday){
                    entity.birthday=new Date(entity.birthday)
                }
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
            vals.push(entity.username)
            vals.push(entity.password)
            vals.push(entity.realname)
            vals.push(entity.sex)
            vals.push(entity.birthday)
            vals.push(entity.phone)
            vals.push(entity.ye)
            vals.push(entity.type)
            vals.push(entity.status)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from user `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from user `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select * from user `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let sql = `select * from user `
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
                if(entity.birthday){
                    entity.birthday=new Date(entity.birthday)
                }
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
            if(entity.username){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` username = ?`
                vals.push(entity.username)
            }
            if(entity.password){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` password = ?`
                vals.push(entity.password)
            }
            if(entity.realname){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` realname = ?`
                vals.push(entity.realname)
            }
            if(entity.sex){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` sex = ?`
                vals.push(entity.sex)
            }
            if(entity.birthday){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` birthday = ?`
                vals.push(entity.birthday)
            }
            if(entity.phone){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` phone = ?`
                vals.push(entity.phone)
            }
            if(entity.ye){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ye = ?`
                vals.push(entity.ye)
            }
            if(entity.type){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` type = ?`
                vals.push(entity.type)
            }
            if(entity.status){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` status = ?`
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
                _conn.end()
                callback({success:true,data})
            },_conn)
        },_conn)
    },

    queryAll:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        _q.findList(sql,r=>{
            callback(r)
        })
    },

    queryOne:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        sql.sql+=" limit 1"
        _q.findOne(sql,r=>{
            callback(r)
        })
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from user where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r=>{
            callback(r)
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

    chgPwd:function (entity,callback,conn) {
        let p={
            sql:"update  user set password = ? where id = ?",
            params:[entity.password,entity.id]
        }
        _q.exec(p,callback,conn)
    },

    del:function (entity,callback,conn) {
        let p=this.buildDelete(entity)
        _q.exec(p,callback,conn)
    },

    deleteById:function (entity,callback,conn) {
        let sqlStr="delete from user where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    },

    findByUsername:function (entity,callback,conn) {
        let sqlStr="select * from user where username = ?"
        let sql={
            sql:sqlStr,
            params:[entity.username]
        }
        _q.findOne(sql,r=>{
            callback(r)
        })
    },

    stat:function (d1,d2) {
        let sql=`select count(*) from user g where g.createTime>=? and g.createTime <= ?`
        let params=[d1,d2]
        return new Promise((rs,j)=>{
            _q.exec({sql,params},r=>{
                rs(r)
            })
        })
    }

}
