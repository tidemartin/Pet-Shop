var _c  = require('../config/mysql-config')
module.exports={
    connect:function () {
        let connection = _c.createConnection()
        return connection
    },
    exec:function (sqlWrapper,callback,conn) {
        let _conn=conn
        let nc=false
        if(!conn){
            nc=true
            _conn=this.connect()
        }
        console.info(sqlWrapper.sql)
        _conn.query(sqlWrapper.sql,sqlWrapper.params,function (err,row,field) {
            console.info(err)
            callback({
                success:err?false:true,
                data:row
            })
        })
        if(nc){
            _conn.end()
        }
    },

    findOne:function (sqlWrapper,callback,conn) {
        let _conn=conn
        let nc=false
        if(!conn){
            nc=true
            _conn=this.connect()
        }
        let p={}
        if(typeof sqlWrapper=='string'){
            p.sql=sqlWrapper
            p.params=[]
        }else{
            p=sqlWrapper
        }
        console.info(p.sql)
        _conn.query(p.sql,p.params,function (err,row,field) {
            console.info(err)
            if(row&&row.length>0){
                callback({
                    success:err?false:true,
                    data:row[0]
                })
            }else{
                callback({
                    success:err?false:true,
                    data:null
                })
            }
        })
        if(nc){
            _conn.end()
        }
    },
    count:function (sqlWrapper,callback,conn) {
        let _conn=conn
        let nc=false
        if(!conn){
            nc=true
            _conn=this.connect()
        }
        console.info(sqlWrapper.sql)
        _conn.query(sqlWrapper.sql,sqlWrapper.params,function (err,row,field) {
            console.info(err)
            if(row&&row.length>0){
                let cont=0
                for(let p in row[0]){
                    cont=row[0][p]
                }
                callback({
                    success:err?false:true,
                    data:cont
                })
            }else{
                callback({
                    success:err?false:true,
                    data:null
                })
            }
        })
        if(nc){
            _conn.end()
        }
    },
    findList:function (sqlWrapper,callback,conn) {
        let _conn=conn
        let nc=false
        if(!conn){
            nc=true
            _conn=this.connect()
        }
        let p={}
        if(typeof sqlWrapper=='string'){
            p.sql=sqlWrapper
            p.params=[]
        }else{
            p=sqlWrapper
        }
        console.info(p.sql)
        _conn.query(p.sql,p.params,function (err,row,field) {
            console.info(err)
            if(row&&row.length>0){
                callback({
                    success:err?false:true,
                    data:row
                })
            }else{
                callback({
                    success:err?false:true,
                    data:[]
                })
            }
        })
        if(nc){
            _conn.end()
        }
    }
}
