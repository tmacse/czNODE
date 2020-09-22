const express = require('express');
const router = express.Router();

const DepartmentMessageModel  = require('../model/DepartmentMessageModel.js')


//获取数量
router.get('/totalNum', (req, res) => {
    DepartmentMessageModel.find().countDocuments()
        .then((total) => {
            res.send({ status: 0, totalDepartmentMessage: total })
        }).catch((error) => {
            res.send({ status: 1, msg: error })
        })
})
//添加内容
router.post('/add', (req, res) => {
    let { title, author, department, content} = req.body
    //判断上述字段都不能为空
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    }else{
        if (title && author && department && content) {
            DepartmentMessageModel.find({ title }).then((data) => {
                if (data.length === 0) {
                    //文章不存在，可以添加
                    return DepartmentMessageModel.insertMany({ title, author, department, content })
                } else {
                    res.send({ err: -3, msg: '已经存在' })
                }
            }).then(() => {
                res.send({ err: 0, msg: '添加文章成功' })
            }).catch((err) => {
                res.send({ err: -2, msg: '添加文章失败' })
                console.log(err)
            })
        } else {
            return res.send({ err: -1, msg: '参数错误' })
        }
    }
   
})
 // 更新文章(此处为更新文章，必然获取文章的ID) ????? 有问题
router.post('/update', (req, res) => {
        const Dmessage = req.body;
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } {
        if (req.session.passport.user.username === 'admin') {
            DepartmentMessageModel.findOneAndUpdate({ _id: Dmessage._id }, Dmessage)
                .then(() => {
                    res.send({ err: 0, msg: '更新成功' })
                }).catch((err) => {
                    // console.error('更新商品异常', err)
                    res.send({ err: -1, msg: '更新失败' })
                })
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }
  
        
    })
router.get('/list', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find().sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获取全部消息
router.get('/searchZuzhi', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find({ department: '组织科' }).find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取组织科消息
router.get('/department', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({}).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获取全部的消息动态
router.get('/searchDepartment', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取组织科消息
router.get('/zuzhi', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({department:'组织科'}).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获取人力资源科的消息动态
router.get('/searchRenli', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find({ department: '人力资源科' }).find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取人力资源科消息
router.get('/renli', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({ department: '人力资源科' }).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获得保卫科消息
router.get('/searchBaowei', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find({ department: '保卫科' }).find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取保卫科消息
router.get('/baowei', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({ department: '保卫科' }).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获取纪检监察科的消息动态
router.get('/searchJijian', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find({ department: '纪检监察科' }).find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取纪检监察科消息
router.get('/jijian', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({ department: '纪检监察科' }).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
//获取宣传科消息动态
router.get('/searchXuanchuan', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        messageTitle,
        messageContent,
        messageAuthor,
    } = req.query
    let contition = {}
    if (messageTitle) {
        contition = {
            title: new RegExp(`^.*${messageTitle}.*$`)
        }
    } else if (messageContent) {
        contition = {
            content: new RegExp(`^.*${messageContent}.*$`)
        }
    }
    else if (messageAuthor) {
        contition = {
            author: new RegExp(`^.*${messageAuthor}.*$`)
        }
    }

    DepartmentMessageModel.find({ department: '宣传科' }).find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})
//获取宣传科消息
router.get('/xuanchuan', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    DepartmentMessageModel.find({ department: '宣传科' }).sort({ date_time: -1 })
        .then(notices => {
            res.send({
                status: 0,
                data: pageFilter(notices, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取通知列表异常', error)
            res.send({
                status: 1,
                msg: '获取通知列表异常, 请重新尝试'
            })
        })
})
router.get('/search', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        noticeTitle,
        noticeContent,
        noticeAuthor,
        noticeDepartment,
    } = req.query
    let contition = {}
    if (noticeTitle) {
        contition = {
            title: new RegExp(`^.*${noticeTitle}.*$`)
        }
    } else if (noticeContent) {
        contition = {
            content: new RegExp(`^.*${noticeContent}.*$`)
        }
    }
    else if (noticeAuthor) {
        contition = {
            author: new RegExp(`^.*${noticeAuthor}.*$`)
        }
    }
    else if (noticeDepartment) {
        contition = {
            department: new RegExp(`^.*${noticeDepartment}.*$`)
        }
    }

    DepartmentMessageModel.find(contition).sort({ date_time: -1 })
        .then(Dmessages => {
            res.send({
                status: 0,
                data: pageFilter(Dmessages, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索通知列表异常', error)
            res.send({
                status: 1,
                msg: '搜索通知列表异常, 请重新尝试'
            })
        })
})

//得到指定数组的分页信息对象
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total
    const list = []
    for (var i = start; i < end; i++) {
        list.push(arr[i])
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}
//删除通知
router.post('/delete', (req, res) => {
    const { title } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            DepartmentMessageModel.deleteOne({ title })
                .then(() => {
                    res.send({ err: 0, msg: '删除通知成功' })
                })
                .catch(() => {
                    res.send({ err: -1, msg: '删除通知失败' })
                })
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }
   
    
})
module.exports = router