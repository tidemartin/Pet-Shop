module.exports={
    fillData:function (req,entity) {
        if(req.session.userInfo){
            if(entity.id){
                entity.updateBy=req.session.userInfo.username
            }else{
                entity.createBy=req.session.userInfo.username
                entity.updateBy=req.session.userInfo.username
            }
        }
        if(entity.id){
            entity.updateTime=new Date()
        }else{
            entity.createTime=new Date()
            entity.updateTime=new Date()
        }
    }
}
