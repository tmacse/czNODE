const express = require('express');
const router = express.Router();
const SoftwareModel = require('../model/SoftwareModel.js');


//获取教案数量
router.get('/totalNum', (req, res) => {
    SoftwareModel.find().countDocuments()
        .then((total) => {
            res.send({ status: 0, totalSoftwares: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
//添加软件
router.post('/add', (req, res) => {
    let { name,url,platform,attr ,downloadNumber} = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            if (name && url && platform && attr) {
                SoftwareModel.find({ name }).then((data) => {
                    if (data.length === 0) {
                        //软件名称不存在，可以添加
                        return SoftwareModel.insertMany({ name, downloadNumber, url, platform, attr })
                    } else {
                        res.send({ err: -3, msg: '软件已经存在' })
                    }
                }).then(() => {
                    res.send({ err: 0, msg: '添加软件成功' })
                }).catch((err) => {
                    res.send({ err: -2, msg: '添加软件失败' })
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
//获取软件数据
router.get('/list', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    SoftwareModel.find().sort({ date_time:-1 })
        .then(softwares => {
            res.send({
                status: 0,
                data: pageFilter(softwares, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
//获取软件列表（搜索的软件列表）
router.get('/search', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        softwareName,
        softwarePlatform,
        softwareAttr,
    } = req.query
    let contition = {}
    if (softwareName) {
        contition = {
            name: new RegExp(`^.*${softwareName}.*$`)
        }
    } else if (softwarePlatform) {
        contition = {
            platform: new RegExp(`^.*${softwarePlatform}.*$`)
        }
    }
    else if (softwareAttr) {
        contition = {
            attr: new RegExp(`^.*${softwareAttr}.*$`)
        }
    }
    
    SoftwareModel.find(contition).sort({ date_time:-1 })
        .then(softwares => {
            res.send({
                status: 0,
                data: pageFilter(softwares, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
        })
})
//删除软件(根据软件名字删除软件)
router.post('/delete', (req, res) => {
    const { name } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            SoftwareModel.deleteOne({ name })
                .then(() => {
                    res.send({ err: 0, msg: '删除软件成功' })
                })
                .catch(() => {
                    res.send({ err: -1, msg: '删除软件失败' })
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
//下载软件
router.get('/download/',(req,res)=>{
    let {name} =req.query
    res.download(`public/software/${name}`)
})
module.exports = router