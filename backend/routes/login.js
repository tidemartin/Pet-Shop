var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var captchapng = require("captchapng")
var userRepo = require("../repo/user-repo")
var audit=require('../utils/audit-utils')

/* 登录请求的url */
router.all('/login', function(req, res) {
    userRepo.findByUsername(req.body,r=>{
        if(r.success){
            if(bcrypt.compareSync(req.body.password, r.data.password)){
                req.session.userInfo=r.data
               if(req.body.from&&req.body.from=='backend'){
                   if(r.data.type!=1){
                       res.json({success:false,msg:'该账号为非管理员账号'})
                       return
                   }
               }
                res.json({success:true,data:r.data})
            }else {
                res.json({success: false,msg:"密码错误"})
            }
        }else {
            res.json(r)
        }
    })
});
router.all('/logout', function(req, res) {
    req.session.userInfo=null
    res.json({success:true})
});
router.all('/register', function(req, res) {
    userRepo.findByUsername(req.body,r=>{
      if(r.success&&r.data){
          res.json({
              success:false,
              msg:"用户已存在"
          })
      }else{
          var salt = bcrypt.genSaltSync();
          var hash = bcrypt.hashSync(req.body.password, salt);
          req.body.password=hash
          audit.fillData(req,req.body)
          userRepo.save(req.body,(r)=>{
              res.json({
                  success:true
              })
          })
      }
    })
});
router.all("/vercode",function (req,res) {
    var mynum = parseInt(Math.random()*9000+1000);
    req.session.captcha = mynum;
    var p = new captchapng(80,30,mynum); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer.from(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
})
router.all("/checkver",function (req,res) {
    let code=req.query.code
    if(req.session.captcha == code){
        res.json({success:true})
    }else{
        res.json({success:false})
    }
})


module.exports = router;
