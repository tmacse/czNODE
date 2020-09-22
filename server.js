const express = require('express');
const db = require('./db/connect');
const bodyparser = require('body-parser');
const path = require('path')

const app = express();
//使用静态中间件
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())
var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');
app.use(require('express-session')({ secret: 'wangbing', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
// 声明使用路由器中间件
const indexRouter = require('./router/indexRouter.js')
//
//引入路由
const userRouter = require('./router/userRouter.js');
const articleRouter = require('./router/articleRouter.js');
const bannerimageFileRouter = require('./router/bannerimageFileRouter.js');
const bannerPicRouter = require('./router/bannerPicRouter.js')
const articleimageFileRouter = require('./router/articleimageFileRouter')//文章中图片缩略图的地址
const softwareFileRouter = require('./router/softwareFileRouter.js')
const musicFileRouter = require('./router/musicFileRouter.js')
const videoFileRouter = require('./router/videoFileRouter.js')
const softwareRouter = require('./router/softwareRouter.js');
const noticeRouter = require('./router/noticeRouter.js');
const roleRouter = require('./router/roleRouter.js')
const bookfileRouter = require('./router/bookfileRouter.js')
const departmentMessageRouter = require('./router/departmentMessageRouter.js')
const videoRouter = require('./router/videoRouter.js')
const musicRouter = require('./router/musicRouter.js')
const picshowRouter = require('./router/picshowRouter.js')
const picshowimageFileRouter = require('./router/picshowimageFileRouter.js')
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/article', (req, res, next) => {
  // console.log(req.body)
  // console.log(req.session)
  next()
}, articleRouter)
app.use('/imageFile', bannerimageFileRouter)
app.use('/articlesImg', articleimageFileRouter)//缩略图
app.use('/softwareFile', softwareFileRouter)
app.use('/software', softwareRouter)
app.use('/notices', noticeRouter)
app.use('/musicFile', musicFileRouter)
app.use('/videoFile', videoFileRouter)
app.use('/role', roleRouter)
app.use('/bookfile', bookfileRouter)
app.use('/departmentMessage', departmentMessageRouter)
app.use('/video', videoRouter)
app.use('/music', musicRouter)
app.use('/banner', bannerPicRouter)
app.use('/picshow', picshowRouter)
app.use('/picshowImg', picshowimageFileRouter)

app.use('/public', express.static(path.join(__dirname, './public')))


app.listen(4000, () => {
  console.log('正在4000端口连接数据库')
})


