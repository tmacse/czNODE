const express = require('express');
const router = express.Router();
const QuantizationModel = require('../model/QuantizationModel.js');

//添加了双争评比的接口（根据季度依次写入数据库）
router.post('/add', (req, res) => {
    const unit = req.body
    if (unit.season === 'season1') {
        //init初始化数据,并且写入第一季度的数据
        QuantizationModel.find({ name: '军需股' }).then((data) => {
            // console.log(data.toString() === '')
            if (data.toString() === '') {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    console.log(item.name, item.Cname)
                    QuantizationModel.insertMany({ name: item.Cname, season1: unit[item.name] })
                })
            } else {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    // console.log(123)
                    QuantizationModel.updateOne({ name: item.Cname }, { season1: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加一季度成功' })
        })
    } else if (unit.season === 'season2') {
        //二季度成绩录入
        QuantizationModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.Cname }, { season2: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加二季度成功' })
        })
    } else if (unit.season === 'season3') {
        //三季度成绩录入
        QuantizationModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.Cname }, { season3: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加三季度单位成功' })
        })
    } else if (unit.season === 'season4') {
        //四季度成绩录入
        QuantizationModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    QuantizationModel.updateOne({ name: item.Cname }, { season4: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加文章成功' })
        })
    }
})

//获取双争评比单位的请求
router.get('/list', async (req, res) => {
    const jx = await QuantizationModel.find({ name: '军需股' })
    const yl = await QuantizationModel.find({ name: '油料股' })
    const ys = await QuantizationModel.find({ name: '运输股' })
    const jy = await QuantizationModel.find({ name: '机场营房股' })
    const hj = await QuantizationModel.find({ name: '航材军械股' })
    const fxgzs = await QuantizationModel.find({ name: '飞行管制室' })
    const qxt = await QuantizationModel.find({ name: '气象台' })
    const yy = await QuantizationModel.find({ name: '医院' })
    const td = await QuantizationModel.find({ name: '通信导航连' })
    const jw = await QuantizationModel.find({ name: '警卫连' })
    const qc = await QuantizationModel.find({ name: '汽车连' })
    const cwl = await QuantizationModel.find({ name: '场务连' })
    const sz = await QuantizationModel.find({ name: '四站连' })
    Promise.all(
        jx, yl, ys, jy, hj, fxgzs, qxt, yy, td, jw, qc, cwl, sz
    ).then(
        (result) => {
            res.send({
                success: true,
                data: [jx[0], yl[0], ys[0], hj[0], fxgzs[0], qxt[0], yy[0], jw[0], td[0], qc[0], cwl[0], sz[0]]
            })
        }
    )
})

module.exports = router