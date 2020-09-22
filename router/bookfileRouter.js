const express = require('express');
const router = express.Router();
const BookFileModel = require('../model/BookFileModel.js')

//获取教案数量
router.get('/totalNum', (req, res) => {
    BookFileModel.find().countDocuments()
        .then((total) => {
            res.send({ status: 0, totalBookFiles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: error})
        })
})
router.post('/add', (req, res) => {
    let { title, author, department, content, category } = req.body
    //判断上述字段都不能为空
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (title && author && department && content && category) {
            BookFileModel.find({ title }).then((data) => {
                if (data.length === 0) {
                    //文章不存在，可以添加
                    return BookFileModel.insertMany({ title, author, department, content, category })
                } else {
                    res.send({ err: -3, msg: '文章已经存在' })
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

router.get('/list', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    BookFileModel.find().sort({ date_time: -1 })
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
// 更新文章(此处为更新文章，必然获取文章的ID) ????? 有问题
router.post('/update', (req, res) => {
        const bookfile = req.body;
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    }else{
        if (req.session.passport.user.username === 'admin') {
            BookFileModel.findOneAndUpdate({ _id: bookfile._id }, bookfile)
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

    BookFileModel.find(contition).sort({ data_time: -1 })
        .then(bookfiles => {
            res.send({
                status: 0,
                data: pageFilter(bookfiles, pageNum, pageSize)
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
            BookFileModel.deleteOne({ title })
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