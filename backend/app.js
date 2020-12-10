var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//上传文件夹设置
app.use('/upload', express.static('F:\\uploads\\pet'))
app.use(session({
    secret: 'mall',
    resave: true,
    saveUninitialized: true,
    rolling:true,
    cookie: { secure: false,maxAge: 180000000 }
}))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
})

var authRouter = require('./routes/auth');
var loginRouter = require('./routes/login')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var brandRouter = require('./routes/brand')
var configRouter = require('./routes/config')
var evalRouter = require('./routes/eval')
var goodsRouter = require('./routes/goods')
var goodsImgRouter = require('./routes/goodsImg')
var goodsSkuRouter = require('./routes/goodsSku')
var goodsTypeRouter = require('./routes/goodsType')
var goodsViewLogRouter = require('./routes/goodsViewLog')
var liveMsgRouter = require('./routes/liveMsg')
var orderRouter = require('./routes/order')
var orderItemRouter = require('./routes/orderItem')
var shoppingCartRouter = require('./routes/shoppingCart')
var userAddressRouter = require('./routes/userAddress')
var upload = require('./routes/upload')

app.use('/index', loginRouter);
app.use('/index', indexRouter);
app.use("/api",authRouter)
app.use('/api', usersRouter);
app.use('/api', brandRouter)
app.use('/api', configRouter)
app.use('/api', evalRouter)
app.use('/api', goodsRouter)
app.use('/api', goodsImgRouter)
app.use('/api', goodsSkuRouter)
app.use('/api', goodsTypeRouter)
app.use('/api', goodsViewLogRouter)
app.use('/api', liveMsgRouter)
app.use('/api', orderRouter)
app.use('/api', orderItemRouter)
app.use('/api', shoppingCartRouter)
app.use('/api',userAddressRouter)
app.use('/',upload)

app.listen(8080)

module.exports=app
