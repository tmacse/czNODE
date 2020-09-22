const express = require('express');
const router = express.Router();

const BannerPicModel = require('../model/BannerPicModel.js');
//添加banner图片
router.post('/add', (req, res) => {
    let {url_address, url} = req.body
    console.log(req.body)
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else{
        if (req.session.passport.user.username === 'admin') {
            if (url_address && url) {
                BannerPicModel.find({ url_address }).then((data) => {
                    if (data.length === 0) {
                        //软件名称不存在，可以添加
                        return BannerPicModel.insertMany({ url_address, url })
                    } else {
                        res.send({ err: -3, msg: 'banner已经存在' })
                    }
                }).then(() => {
                    res.send({ err: 0, msg: '添加banner成功' })
                }).catch((err) => {
                    res.send({ err: -2, msg: '添加banner失败' })
                    console.log(err)
                })
            } else {
                return res.send({ err: -1, msg: '参数错误' })
            }
        } else {
            res.send({ err: -999, msg: '没有相关权限' })
        }
    }

    //判断上述字段都不能为空
    

})

module.exports = router