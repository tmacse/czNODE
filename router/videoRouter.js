const express = require('express');
const router = express.Router();
const VideoModel = require('../model/VideoModel.js');

router.post('/add', (req, res) => {
    let { name, url, attr, desc, main_actor, director } = req.body
    console.log(req.body)
    //判断上述字段都不能为空
    if (name && url && desc && attr && main_actor && director) {
        VideoModel.find({ name }).then((data) => {
            if (data.length === 0) {
                //视频名称不存在，可以添加
                return VideoModel.insertMany({ name, url, desc, attr, main_actor, director })
            } else {
                res.send({ err: -3, msg: '视频已经存在' })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加视频成功' })
        }).catch((err) => {
            res.send({ err: -2, msg: '添加视频失败' })
            console.log(err)
        })
    } else {
        return res.send({ err: -1, msg: '参数错误' })
    }
})

//获取视频数据
router.get('/list', (req, res) => {
    const { pageNum, pageSize } = req.query
    VideoModel.find().sort({ date_time: -1 })
        .then(videos => { res.send({ status: 0, data: pageFilter(videos, pageNum, pageSize) }) })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({ status: 1, msg: '获取文章列表异常, 请重新尝试' })
        })
})
//获取视频列表（搜索的视频列表）
router.get('/search', (req, res) => {
    const { pageNum, pageSize, searchName, videoName, videoDesc, videoAttr, } = req.query
    let contition = {}
    if (videoName) {
        contition = { name: new RegExp(`^.*${videoName}.*$`) }
    } else if (videoDesc) {
        contition = { desc: new RegExp(`^.*${videoDesc}.*$`) }
    }
    else if (videoAttr) {
        contition = { attr: new RegExp(`^.*${videoAttr}.*$`) }
    }

    VideoModel.find(contition).sort({ date_time: -1 })
        .then(videos => { res.send({ status: 0, data: pageFilter(videos, pageNum, pageSize) }) })
        .catch(error => {
            console.error('搜索列表异常', error)
            res.send({ status: 1, msg: '搜索视频列表异常, 请重新尝试' })
        })
})
//删除视频(根据视频名字删除软件)
router.post('/delete', (req, res) => {
    const { name } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            VideoModel.deleteOne({ name })
                .then(() => { res.send({ err: 0, msg: '删除视频成功' }) })
                .catch(() => { res.send({ err: -1, msg: '删除视频失败' }) })
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }



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

module.exports = router