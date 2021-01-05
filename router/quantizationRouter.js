const express = require('express');
const router = express.Router();
const QuantizationModel = require('../model/QuantizationModel.js');

//添加文章（包括精品课程、案列分析和活动概况的总体路由）
router.post('/add', (req, res) => {
    const unit = req.body
    if (unit.season === 'season1') {
        //init初始化数据,并且写入第一季度的数据
        QuantizationModel.find({ name: 'jx' }).then((data) => {
            if (data === []) {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.insertMany({ name: item.name, season1: unit[item.name] })
                })
            } else {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.name }, { season1: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加一季度成功' })
        })
    } else if (unit.season === 'season2') {
        //二季度成绩录入
        QuantizationModel.find({ name: 'jx' }).then((data) => {
            if (data.length !== 0) {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.name }, { season2: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加二季度成功' })
        })
    } else if (unit.season === 'season3') {
        //三季度成绩录入
        QuantizationModel.find({ name: 'jx' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.name }, { season3: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加三季度单位成功' })
        })
    } else if (unit.season === 'season4') {
        //四季度成绩录入
        QuantizationModel.find({ name: 'jx' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.name }, { season4: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加文章成功' })
        })
    }
})


module.exports = router