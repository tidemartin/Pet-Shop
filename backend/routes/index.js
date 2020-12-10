var express = require('express');
var router = express.Router();
var brandRepo = require("../repo/brand-repo")
var userRepo = require("../repo/user-repo")
var audit=require('../utils/audit-utils')
var configRepo = require('../repo/config-repo')
var goodsRepo = require('../repo/goods-repo')
var typeRepo = require('../repo/goodsType-repo')
var evalRepo = require('../repo/eval-repo')
var livemsgRepo = require('../repo/liveMsg-repo')
var goodsViewRepo = require('../repo/goodsViewLog-repo')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/user/current', function(req, res, next) {
  let userInfo= req.session.userInfo
  if(userInfo){
    userRepo.queryById(userInfo,cb=>{
      res.json(cb)
    })
  }else {
    res.json({success:false})
  }
});

router.all('/data', function(req, res, next) {
  configRepo.queryAll(req.body,callback=>{
    res.json(callback)
  })
})

router.all('/recommend', function(req, res, next) {
  let finish=2
  let data={}
  goodsRepo.queryPage({page:1,size:10},callback=>{
    data.goodses=callback.data.content
    if(--finish==0){
      res.json({success:true,data})
    }
  })
  brandRepo.queryPage({page:1,size: 3},cb=>{
    data.brands=cb.data.content
    if(--finish==0){
      res.json({success:true,data})
    }
  })
})

router.all('/hot', function(req, res, next) {
  let finish=2
  let data={}
  goodsRepo.queryPage({page:1,size:10},callback=>{
    data.goodses=callback.data.content
    if(--finish==0){
      res.json({success:true,data})
    }
  })
  brandRepo.queryPage({page:1,size: 3},cb=>{
    data.brands=cb.data.content
    if(--finish==0){
      res.json({success:true,data})
    }
  })
})

router.all('/brand', function(req, res, next) {
  brandRepo.queryAll({},cb=>{
      res.json(cb)
  })
})

router.all('/type', function(req, res, next) {
  typeRepo.queryAll({},cb=>{
    res.json(cb)
  })
})

router.all('/eval', function(req, res, next) {
  evalRepo.queryPage(req.body,cb=>{
    res.json(cb)
  })
})

router.all('/livemsg', function(req, res, next) {
  livemsgRepo.queryPage(req.body,cb=>{
    res.json(cb)
  })
})


router.all('/search/adv', function(req, res, next) {
  goodsRepo.queryPage(req.body,cb=>{
    res.json({success:true,data:cb.data})
  })
})

router.all('/goods/detail', function(req, res, next) {
  let userInfo= req.session.userInfo
  let entity={
    goodsId:req.body.id,
    accessTime:new Date()
  }
  if(userInfo){
    entity.userId=userInfo.id
  }
  goodsViewRepo.save(entity,()=>{})

  goodsRepo.queryById(req.body,cb=>{
    res.json({success:true,data:cb.data})
  })
})

router.all('/goodsType/cascadetype', function(req, res, next) {
  typeRepo.cascadetype(req.body,r=>{
    res.json(r)
  })
})

module.exports = router;
