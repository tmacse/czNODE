const express = require('express');
const router = express.Router();
const RoleModel = require('../model/RoleModel')
// 获取角色列表
router.get('/list', (req, res) => {
    if (req.session.passport.user.username === 'admin'){
        RoleModel.find()
            .then(roles => {
                res.send({
                    status: 0,
                    data: roles
                })
            })
            .catch(error => {
                console.error('获取角色列表异常', error)
                res.send({
                    status: 1,
                    msg: '获取角色列表异常, 请重新尝试'
                })
            })
    }else{
        res.send({ err: -999, msg: '没有相关权限' })
    }
   
})
// 添加角色
router.post('/add', (req, res) => {
    const {
        roleName
    } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            RoleModel.create({
                name: roleName
            })
                .then(role => {
                    res.send({
                        status: 0,
                        data: role
                    })
                })
                .catch(error => {
                    console.error('添加角色异常', error)
                    res.send({
                        status: 1,
                        msg: '添加角色异常, 请重新尝试'
                    })
                })
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }
 
   
})
// 更新角色(设置权限)
router.post('/update', (req, res) => {
    const role = req.body
    role.auth_time = Date.now()
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    }else{
        if (req.session.passport.user.username === 'admin') {
            RoleModel.findOneAndUpdate({
                _id: role._id
            }, role)
                .then(oldRole => {
                    // console.log('---', oldRole._doc)
                    res.send({
                        status: 0,
                        data: {
                            ...oldRole._doc,
                            ...role
                        }
                    })
                })
                .catch(error => {
                    console.error('更新角色异常', error)
                    res.send({
                        status: 1,
                        msg: '更新角色异常, 请重新尝试'
                    })
                })
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }

   
})



module.exports = router