var express = require('express');
var router = express.Router();
var repo = require("../repo/user-repo")
var audit=require('../utils/audit-utils')
var multer  = require('multer')
var upload = multer({ dest: 'F:\\uploads\\pet\\' })
const fs = require("fs")
router.all('/api/upload/upload',upload.single('file'), function(req, res, next) {
    let file=req.file.path
    let pifx=req.file.originalname.split(".")[req.file.originalname.split(".").length-1]
    fs.rename(file, file+"."+pifx, function(err) {
        res.json({success:true,path:req.file.filename+"."+pifx})
    })

})

module.exports = router;
