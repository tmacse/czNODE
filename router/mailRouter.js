const express = require('express');
const router = express.Router();

const MailModel = require("../model/MailModel")

//添加邮件内容
router.post('/add', (req, res) => {
    let { leader, title, content, department, name } = req.body
    console.log(req.body)
    if (leader && content && title) {
        MailModel.insertMany({ leader, title, content, department, name })
            .then(() => { res.send({ err: 0, msg: '添加留言成功' }) })
            .catch(() => { res.send({ err: -1, msg: '添加邮件失败' }) })
    }
}
)
//获取邮件的列表（未经过查看的）
const MAIL_LIST = ["zz", "zw", "zr", 'jw']
const LEADER_LIST = ['站长', '政委', '主任', '纪委书记', '纪检干事']
router.get('/listUnchecked', (req, res) => {
    const { pageNum, pageSize } = req.query
    if (typeof req.user != "undefined") {
        switch (req.user.username) {
            //站长能看zz的list
            case LEADER_LIST[0]:
                MailModel.find({
                    $and: [{ ischecked: false }, { leader: MAIL_LIST[0] }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
                break;
            //政委能看zw的list
            case LEADER_LIST[1]:
                MailModel.find({
                    $and: [{ ischecked: false }, { leader: MAIL_LIST[1] }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
                break;
            //主任能看zr的list
            case LEADER_LIST[2]:
                MailModel.find({
                    $and: [{ ischecked: false }, { leader: MAIL_LIST[2] }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
                break;
            case LEADER_LIST[3], LEADER_LIST[4]:
                MailModel.find({
                    $and: [{ ischecked: false }, { leader: MAIL_LIST[3] }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
                break;
            default:
                res.send({ err: -999, msg: '没有权限' })
                break;
        }
    }
    else {
        res.send({ err: -999, msg: '没有权限' })
    }

})
//获取邮件的列表（已经经过查看的）
router.get('/checkedList', (req, res) => {
    const { pageNum, pageSize } = req.query
    if (typeof req.user != "undefined") {
        switch (req.user.username) {
            case LEADER_LIST[0]:
                MailModel.find({
                    $and: [{ ischecked: true }, { leader: "zz" }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
                break;
            case LEADER_LIST[1]:
                MailModel.find({
                    $and: [{ ischecked: true }, { leader: "zw" }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
            case LEADER_LIST[2]:
                MailModel.find({
                    $and: [{ ischecked: true }, { leader: 'zr' }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })
            case LEADER_LIST[3], LEADER_LIST[4]:
                MailModel.find({
                    $and: [{ ischecked: true }, { leader: 'jw' }]
                }).sort({ date_time: -1 }).then(
                    mails => {
                        res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
                    }).catch(error => {
                        console.error('获取邮件列表异常', error)
                        res.send({ status: 1, msg: '获取邮件列表异常, 请重新尝试' })
                    })

            default:
                break;
        }
    }
    else {
        res.send({ err: -999, msg: '没有权限' })
    }
})

//删除邮件
router.post('/delete', (req, res) => {
    const { _id } = req.body
    console.log(req.body)
    MailModel.deleteOne({ _id: _id }).then(() => {
        res.send({ err: 0, msg: '删除邮件成功' })
    }).catch(() => {
        res.send({ err: -1, msg: '删除邮件失败' })
    })
})

//更新mail状态
router.post('/updateStatus', (req, res) => {
    const { content } = req.body
    MailModel.findOneAndUpdate({ content: content }, { ischecked: true })
        .then((oldMail) => { console.log('111'), res.send({ err: 0, msg: '更新文章成功', data: oldMail }) })
        .catch((error) => { console.log(error), res.send({ err: 1, msg: '更新文章状态异常, 请重新尝试' }) })
})
//查询邮件（依照标题标题或者内容）
router.get('/search', (req, res) => {
    const { pageNum, pageSize, searchName, mailTitle, mailContent, mailAuthor, mailDepartment, mailCategory } = req.query
    let contition = {}
    if (mailTitle) {
        contition = { title: new RegExp(`^.*${mailTitle}.*$`) }
    } else if (mailContent) {
        contition = { content: new RegExp(`^.*${mailContent}.*$`) }
    }
    else if (mailAuthor) {
        contition = { name: new RegExp(`^.*${mailAuthor}.*$`) }
    }
    else if (mailDepartment) {
        contition = { department: new RegExp(`^.*${mailDepartment}.*$`) }
    }
    console.log(contition)
    MailModel.find(contition).find({ $and: [{ ischecked: true }, { $or: [{ leader: "brigadier" }, { leader: 'commissar' }] }] }).sort({ date_time: -1 })
        .then(mails => {
            console.log(mails)
            res.send({ status: 0, data: pageFilter(mails, pageNum, pageSize) })
        })
        .catch(error => {
            console.error('搜索邮件列表异常', error)
            res.send({ status: 1, msg: '搜索邮件列表异常, 请重新尝试' })
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

    return { pageNum, total, pages, pageSize, list }
}
module.exports = router