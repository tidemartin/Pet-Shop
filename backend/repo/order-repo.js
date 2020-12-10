var _q=require('../utils/mysql-utils')
var _c=require('../config/mysql-config')
var orderItemRepo = require('./orderItem-repo')

module.exports = {

    buildInsert:function(entity){
        let sql=`insert into \`order\`(
            orderNo,
            userId,
            amount,
            address,
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
        ?,?,?,?)`
        let vals=[]
        if(entity.createTime){
        entity.createTime=new Date(entity.createTime)
        }
        if(entity.updateTime){
        entity.updateTime=new Date(entity.updateTime)
        }
        vals.push(entity.orderNo)
        vals.push(entity.userId)
        vals.push(entity.amount)
        vals.push(entity.address)
        vals.push(entity.status)
        vals.push(entity.createTime)
        vals.push(entity.updateTime)
        vals.push(entity.createBy)
        vals.push(entity.updateBy)
        return {sql,params:vals}
    },
    buildUpdate:function(entity){
        let sql=`update \`order\` set
                orderNo = ? ,
                userId = ? ,
                amount = ? ,
                address = ? ,
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
            vals.push(entity.orderNo)
            vals.push(entity.userId)
            vals.push(entity.amount)
            vals.push(entity.address)
            vals.push(entity.status)
        vals.push(entity.updateTime)
        vals.push(entity.updateBy)
        vals.push(entity.id)
        return {sql,params:vals}
    },
    buildDelete:function(entity){
        let sql=`delete from \`order\` `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildCont:function(entity){
        let sql = `select count(*) from \`order\` `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildSelect:function(entity){
        let sql = `select c.*,u.username from \`Order\` c
         left join user u on u.id=c.userId `
        let q=this.buildWhere(entity)
        q.sql=sql+q.sql
        return q
    },
    buildPageSelect:function(entity){
        let sql = `select c.*,u.username from \`Order\` c
         left join user u on u.id=c.userId `
        let q=this.buildWhere(entity,'c.')
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
            sql+= ` ${alise}id = ?`
            vals.push(entity.id)
        }
            if(entity.orderNo){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}orderNo like concat('%',?,'%')`
                vals.push(entity.orderNo)
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
            if(entity.amount){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}amount = ?`
                vals.push(entity.amount)
            }
            if(entity.address){
                if(first){
                    first=false
                    sql=" where"
                }else{
                    sql+=" and"
                }
                sql+= ` ${alise}address = ?`
                vals.push(entity.address)
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
        let p=parseInt(entity.page)
        if(p>0){
            p-=1
        }
        let poff=(p)*entity.size
        sql = " limit "+ poff+","+entity.size
        return {sql,params:[]}
    },

    queryPage:function (entity,callback,conn) {
        let _conn=_c.createConnection()
        let contsql=this.buildCont(entity)
        _q.count(contsql,r_cont=>{
            let data={totalElements:r_cont.data}
            let listsql=this.buildPageSelect(entity)
            _q.findList(listsql,r_list=>{
                data.content=r_list.data
                let ifinsh=r_list.data.length
                if(ifinsh==0){
                    callback(data)
                    return
                }
                for (let i = 0; i < data.content.length; i++) {
                    let order=data.content[i]
                    _q.findList({sql:"select * from orderItem where orderId =?",params:[order.id]},r=>{
                        order.orderItem=r.data
                        ifinsh--
                        if(ifinsh==0){
                            callback(data)
                        }
                    })
                }
            },_conn)
        },_conn)
    },

    queryAll:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        _q.findList(sql,r_list=>{
            let ifinsh=r_list.data.length
            if(ifinsh==0){
                callback(r_list)
                return
            }
            for (let i = 0; i < r_list.data.length; i++) {
                let order=r_list.data[i]
                _q.findList({sql:"select * from orderItem where orderId =?",params:[order.id]},r=>{
                    order.orderItem=r.data
                    ifinsh--
                    if(ifinsh==0){
                        callback(r_list)
                    }
                })
            }
        })
    },

    queryOne:function (entity,callback,conn) {
        let sql=this.buildSelect(entity)
        sql.sql+=" limit 1"
        _q.findOne(sql,r_list=>{
            let order=r_list.data
            _q.findList({sql:"select * from orderItem where orderId =?",params:[order.id]},r=>{
                order.orderItem=r.data
                callback(r_list)
            })
        })
    },

    queryById:function (entity,callback,conn) {
        let sqlStr="select * from `order` where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.findOne(sql,r_list=>{
            let order=r_list.data
            _q.findList({sql:"select * from orderItem where orderId =?",params:[order.id]},r=>{
                order.orderItem=r.data
                callback(r_list)
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
        if(entity.orderItem){
            finish+=entity.orderItem.length
        }
        var _conn=_q.connect()
        _q.exec(p,er=>{
            if(entity.id){
                _conn.end()
                callback()
            }else{
                _q.findOne({sql:"select last_insert_id() as id",params:[]},r=> {
                    entity.id = r.data.id
                    if (entity.orderItem.length>0) {
                        for (let i = 0; i < entity.orderItem.length; i++) {
                            let item = entity.orderItem[i]
                            item.orderId = entity.id
                            item.id = null
                            orderItemRepo.save(entity.orderItem[i], r => {
                                if (--finish == 0) {
                                    _conn.end()
                                    callback()
                                }
                            }, _conn)
                        }
                    }else{
                        _conn.end()
                        callback()
                    }
                },_conn)
            }
        },_conn)
    },

    del:function (entity,callback,conn) {
        let p=this.buildDelete(entity)
        _q.exec(p,callback,conn)
    },

    deleteById:function (entity,callback,conn) {
        let sqlStr="delete from `order` where id = ?"
        let sql={
            sql:sqlStr,
            params:[entity.id]
        }
        _q.exec(sql,r=>{
            callback(r)
        })
    },

    stat:function (d1,d2) {
        let sql=`select count(*) from \`order\` g where g.createTime>=? and g.createTime <= ?`
        let params=[d1,d2]
        return new Promise((rs,j)=>{
            _q.exec({sql,params},r=>{
                rs(r)
            })
        })
    },
    jestat:function (d1,d2) {
        let sql=`select sum(g.amount) from \`order\` g where g.createTime>=? and g.createTime <= ? and g.status>=1`
        let params=[d1,d2]
        return new Promise((rs,j)=>{
            _q.exec({sql,params},r=>{
                rs(r)
            })
        })
    }
}
