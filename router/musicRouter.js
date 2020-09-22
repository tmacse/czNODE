const express = require('express');
const router = express.Router();
const MusicModel = require('../model/MusicModel.js');
//添加音乐
router.post('/add', (req, res) => {
    let { name, url, actor} = req.body
    console.log(req.body)
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            //判断上述字段都不能为空
            if (name && url && actor) {
                MusicModel.find({ name }).then((data) => {
                    if (data.length === 0) {
                        //软件名称不存在，可以添加
                        return MusicModel.insertMany({ name, url, actor })
                    } else {
                        res.send({ err: -3, msg: '音乐已经存在' })
                    }
                }).then(() => {
                    res.send({ err: 0, msg: '添加音乐成功' })
                }).catch((err) => {
                    res.send({ err: -2, msg: '添加音乐失败' })
                    console.log(err)
                })
            } else {
                return res.send({ err: -1, msg: '参数错误' })
            }
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }

    }


})

//获取音乐数据
router.get('/list', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    MusicModel.find().sort({ date_time: -1 })
        .then(musics => {
            res.send({
                status: 0,
                data: pageFilter(musics, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取音乐列表异常', error)
            res.send({
                status: 1,
                msg: '获取音乐列表异常, 请重新尝试'
            })
        })
})
//获取音乐列表（搜索的音乐列表）
router.get('/search', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        musicName,
        musicActor,
    } = req.query
    let contition = {}
    if (musicName) {
        contition = {
            name: new RegExp(`^.*${musicName}.*$`)
        }
    } 
    else if (musicActor) {
        contition = {
            actor: new RegExp(`^.*${musicActor}.*$`)
        }
    }

    MusicModel.find(contition).sort({ date_time: -1 })
        .then(musics => {
            res.send({
                status: 0,
                data: pageFilter(musics, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索列表异常', error)
            res.send({
                status: 1,
                msg: '搜索音乐列表异常, 请重新尝试'
            })
        })
})
//删除软件(根据软件名字删除软件)
router.post('/delete', (req, res) => {
    const { name } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    }else{
        if (req.session.passport.user.username === 'admin') {
            MusicModel.deleteOne({ name })
                .then(() => {
                    res.send({ err: 0, msg: '删除音乐成功' })
                })
                .catch(() => {
                    res.send({ err: -1, msg: '删除音乐失败' })
                })
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