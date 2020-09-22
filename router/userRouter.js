const express = require('express');
var LocalStrategy = require('passport-local').Strategy
const router = express.Router();
const passport = require('../utils/passport.js')

const UserModel = require('../model/UserModel');
const RoleModel = require('../model/RoleModel.js')
var session = require('express-session');

router.post('/add', (req, res) => {
    // 读取请求参数数据
    const {
        username,
        password
    } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            UserModel.findOne({
                username
            })
                .then(user => {
                    // 如果user有值(已存在)
                    if (user) {
                        // 返回提示错误的信息
                        res.send({
                            status: 1,
                            msg: '此用户已存在'
                        })
                        return new Promise(() => { })
                    } else { // 没值(不存在)
                        // 保存
                        return UserModel.create({
                            ...req.body,
                            password: (password || 'wangbing')
                        })
                    }
                })
                .then(user => {
                    // 返回包含user的json数据
                    res.send({
                        status: 0,
                        data: user
                    })
                })
                .catch(error => {
                    console.error('注册异常', error)
                    res.send({
                        status: 1,
                        msg: '添加用户异常, 请重新尝试'
                    })
                })
        } else {
            res.send({ status: -999, msg: '没有相关权限' })
        }
    }
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)

   
})
// 更新用户
router.post('/update', (req, res) => {
    const user = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            UserModel.findOneAndUpdate({
                _id: user._id
            }, user)
                .then(oldUser => {
                    const data = Object.assign(oldUser, user)
                    // 返回
                    res.send({
                        status: 0,
                        data
                    })
                })
                .catch(error => {
                    console.error('更新用户异常', error)
                    res.send({
                        status: 1,
                        msg: '更新用户异常, 请重新尝试'
                    })
                })
        } else {
            res.send({ status: -999, msg: '没有相关权限' })
        }
    }

    
})
// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         UserModel.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             if (!user.validPassword(password)) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         });
//     }
// ));
router.post('/login', passport.authenticate('local'), (req, res) => {
    const {
        username,
        password
    } = req.body
    // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
    UserModel.findOne({
        username,
        password
    })
        .then(user => {
            if (user) { // 登陆成功
                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {
                    maxAge: 1000*60*60*24*7
                })
                if (user.role_id) {
                    RoleModel.findOne({
                        _id: user.role_id
                    })
                        .then(role => {
                            user._doc.role = role
                            console.log('role user', user)
                            res.send({
                                status: 0,
                                data: user
                            })
                        })
                } else {
                    user._doc.role = {
                        menus: []
                    }
                    // 返回登陆成功信息(包含user)
                    res.send({
                        status: 0,
                        data: user
                    })
                }

            } else { // 登陆失败
                res.send({
                    status: 1,
                    msg: '用户名或密码不正确!'
                })
            }
        })
        .catch(error => {
            console.error('登陆异常', error)
            res.send({
                status: 1,
                msg: '登陆异常, 请重新尝试'
            })
        })
})
// 删除用户
router.post('/delete', (req, res) => {
    const {
        userId
    } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            UserModel.deleteOne({
                _id: userId
            })
                .then((doc) => {
                    res.send({
                        status: 0
                    })
                })
        } else {
            res.send({ status: -999, msg: '没有相关权限' })
        }
    }
   
  
})
// 获取所有用户列表
router.get('/list', (req, res) => {
    UserModel.find({
        username: {
            '$ne': 'admin'
        }
    })
        .then(users => {
            RoleModel.find().then(roles => {
                res.send({
                    status: 0,
                    data: {
                        users,
                        roles
                    }
                })
            })
        })
        .catch(error => {
            console.error('获取用户列表异常', error)
            res.send({
                status: 1,
                msg: '获取用户列表异常, 请重新尝试'
            })
        })
})

module.exports = router