const easyMonitor = require('easy-monitor');
// easyMonitor('czNodeAdmin');
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
const articleimageFileRouter = require('./router/articleimageFileRouter')//文章中图片缩略图的地址
const videoFileRouter = require('./router/videoFileRouter.js')
const noticeRouter = require('./router/noticeRouter.js');
const roleRouter = require('./router/roleRouter.js')
const departmentMessageRouter = require('./router/departmentMessageRouter.js')
const videoRouter = require('./router/videoRouter.js')
const listRouter = require('./router/listRouter.js')
const mailRouter = require('./router/mailRouter.js')
const articleFileRouter = require('./router/articleFileRouter.js')

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/mail', mailRouter)
//引入文章和文章的图片地址所需的路由
app.use('/article', articleRouter)
app.use('/file', articleFileRouter)//文章的文件上传和删除路由
app.use('/articlesImg', articleimageFileRouter)//缩略图
//引入通知的路由
app.use('/notices', noticeRouter)
app.use('/list', listRouter)
//引入视频地址的路由
app.use('/video', videoRouter)
app.use('/videoFile', videoFileRouter)
//引入角色需要的路由
app.use('/role', roleRouter)
//引入强军动态（各个部门办公室所发的通知之类的信息）
app.use('/departmentMessage', departmentMessageRouter)


//引入静态地址
app.use('/public', express.static(path.join(__dirname, './public')))


app.listen(5000, () => {
  console.log('正在5000端口连接数据库')
})


