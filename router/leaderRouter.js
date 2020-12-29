const express = require('express');
const router = express.Router();
const LeaderModel = require('../model/LeaderModel');

//添加文章（包括精品课程、案列分析和活动概况的总体路由）
router.post('/add', (req, res) => {
    let { leader, adviser } = req.body
    console.log("添加的文章内容", req.body)
    //判断上述字段都不能为空
    if (leader && adviser) {
        LeaderModel.insertMany({ leader, adviser }).then(() => {
            res.send({ err: 0, msg: '11111' })
        })
    }
})


module.exports = router