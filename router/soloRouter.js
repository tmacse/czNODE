const express = require('express');
const router = express.Router();
const SoloModel = require('../model/SoloModel.js');

//添加了双争(人员)评比的接口（根据季度依次写入数据库）
router.post('/add', (req, res) => {
    const unit = req.body
    if (unit.season === 'season1') {
        //init初始化数据,并且写入第一季度“四有”个人的数据
        SoloModel.find({ name: '军需股' }).then((data) => {
            if (data.toString() === '') {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    console.log(item.name, item.Cname)
                    SoloModel.insertMany({ name: item.Cname, season1: unit[item.name] })
                })
            } else {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    SoloModel.updateOne({ name: item.Cname }, { season1: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加一季度人员成功' })
        })
    } else if (unit.season === 'season2') {
        //二季度成绩录入
        SoloModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    SoloModel.updateOne({ name: item.Cname }, { season2: unit[item.name] }, function () {
                    })
                })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加二季度人员成功' })
        })
    } else if (unit.season === 'season3') {
        //三季度成绩录入
        SoloModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    SoloModel.updateOne({ name: item.Cname }, { season3: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加三季度人员成功' })
        })
    } else if (unit.season === 'season4') {
        //四季度成绩录入
        SoloModel.find({ name: '军需股' }).then((data) => {
            if (data.length !== 0) {
                return (BASE_ALL_TUPLE_DEPARTMENT.slice(3).map((item) => {
                    SoloModel.updateOne({ name: item.Cname }, { season4: unit[item.name] }, function () {
                    })
                }))
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加四季度人员成功' })
        })
    }
})

//获取双争评比个人的请求
router.get('/list', async (req, res) => {
    const jx = await SoloModel.find({ name: '军需股' })
    const yl = await SoloModel.find({ name: '油料股' })
    const ys = await SoloModel.find({ name: '运输股' })
    const jy = await SoloModel.find({ name: '机场营房股' })
    const hj = await SoloModel.find({ name: '航材军械股' })
    const fxgzs = await SoloModel.find({ name: '飞行管制室' })
    const qxt = await SoloModel.find({ name: '气象台' })
    const yy = await SoloModel.find({ name: '医院' })
    const td = await SoloModel.find({ name: '通信导航连' })
    const jw = await SoloModel.find({ name: '警卫连' })
    const qc = await SoloModel.find({ name: '汽车连' })
    const cwl = await SoloModel.find({ name: '场务连' })
    const sz = await SoloModel.find({ name: '四站连' })
    Promise.all(
        jx, yl, ys, jy, hj, fxgzs, qxt, yy, td, jw, qc, cwl, sz
    ).then(
        (result) => {
            console.log('请求来到了后台')
            res.send({
                success: true,
                title: '一季度优秀个人',
                content: [
                    { 'department': '军需股', 'names': jx[0].season1, '_id': jx[0]._id },
                    { 'department': '油料股', 'names': yl[0].season1, '_id': yl[0]._id },
                    { 'department': '运输股', 'names': ys[0].season1, '_id': ys[0]._id },
                    { 'department': '机场营房股', 'names': jy[0].season1, '_id': jy[0]._id },
                    { 'department': '航材军械股', 'names': hj[0].season1, '_id': hj[0]._id },
                    { 'department': '飞行管制室', 'names': fxgzs[0].season1, '_id': fxgzs[0]._id },
                    { 'department': '气象台', 'names': qxt[0].season1, '_id': qxt[0]._id },
                    { 'department': '医院', 'names': yy[0].season1, '_id': yy[0]._id },
                    { 'department': '通信导航连', 'names': td[0].season1, '_id': td[0]._id },
                    { 'department': '警卫连', 'names': jw[0].season1, '_id': jw[0]._id },
                    { 'department': '汽车连', 'names': qc[0].season1, '_id': qc[0]._id },
                    { 'department': '场务连', 'names': cwl[0].season1, '_id': cwl[0]._id },
                    { 'department': '四站连', 'names': sz[0].season1, '_id': sz[0]._id }
                ]
            })
        }
    )
})

//获取各个单位新闻列表（首页）
router.post('/listBySeason', async (req, res) => {
    let { season } = req.body
    const jx = await SoloModel.find({ name: '军需股' })
    const yl = await SoloModel.find({ name: '油料股' })
    const ys = await SoloModel.find({ name: '运输股' })
    const jy = await SoloModel.find({ name: '机场营房股' })
    const hj = await SoloModel.find({ name: '航材军械股' })
    const fxgzs = await SoloModel.find({ name: '飞行管制室' })
    const qxt = await SoloModel.find({ name: '气象台' })
    const yy = await SoloModel.find({ name: '医院' })
    const td = await SoloModel.find({ name: '通信导航连' })
    const jw = await SoloModel.find({ name: '警卫连' })
    const qc = await SoloModel.find({ name: '汽车连' })
    const cwl = await SoloModel.find({ name: '场务连' })
    const sz = await SoloModel.find({ name: '四站连' })
    Promise.all(
        jx, yl, ys, jy, hj, fxgzs, qxt, yy, td, jw, qc, cwl, sz
    ).then(
        (result) => {
            if (season === '二季度优秀个人') {
                res.send({
                    success: true,
                    title: season,
                    content: [
                        { 'department': '军需股', 'names': jx[0].season2, '_id': jx[0]._id },
                        { 'department': '油料股', 'names': yl[0].season2, '_id': yl[0]._id },
                        { 'department': '运输股', 'names': ys[0].season2, '_id': ys[0]._id },
                        { 'department': '机场营房股', 'names': jy[0].season2, '_id': jy[0]._id },
                        { 'department': '航材军械股', 'names': hj[0].season2, '_id': hj[0]._id },
                        { 'department': '飞行管制室', 'names': fxgzs[0].season2, '_id': fxgzs[0]._id },
                        { 'department': '气象台', 'names': qxt[0].season2, '_id': qxt[0]._id },
                        { 'department': '医院', 'names': yy[0].season2, '_id': yy[0]._id },
                        { 'department': '通信导航连', 'names': td[0].season2, '_id': td[0]._id },
                        { 'department': '警卫连', 'names': jw[0].season2, '_id': jw[0]._id },
                        { 'department': '汽车连', 'names': qc[0].season2, '_id': qc[0]._id },
                        { 'department': '场务连', 'names': cwl[0].season2, '_id': cwl[0]._id },
                        { 'department': '四站连', 'names': sz[0].season2, '_id': sz[0]._id }
                    ]
                })
            } else if (season === '三季度优秀个人') {
                res.send({
                    success: true,
                    title: season,
                    content: [
                        { 'department': '军需股', 'names': jx[0].season3, '_id': jx[0]._id },
                        { 'department': '油料股', 'names': yl[0].season3, '_id': yl[0]._id },
                        { 'department': '运输股', 'names': ys[0].season3, '_id': ys[0]._id },
                        { 'department': '机场营房股', 'names': jy[0].season3, '_id': jy[0]._id },
                        { 'department': '航材军械股', 'names': hj[0].season3, '_id': hj[0]._id },
                        { 'department': '飞行管制室', 'names': fxgzs[0].season3, '_id': fxgzs[0]._id },
                        { 'department': '气象台', 'names': qxt[0].season3, '_id': qxt[0]._id },
                        { 'department': '医院', 'names': yy[0].season3, '_id': yy[0]._id },
                        { 'department': '通信导航连', 'names': td[0].season3, '_id': td[0]._id },
                        { 'department': '警卫连', 'names': jw[0].season3, '_id': jw[0]._id },
                        { 'department': '汽车连', 'names': qc[0].season3, '_id': qc[0]._id },
                        { 'department': '场务连', 'names': cwl[0].season3, '_id': cwl[0]._id },
                        { 'department': '四站连', 'names': sz[0].season3, '_id': sz[0]._id }
                    ]
                })
            } else {
                res.send({
                    success: true,
                    title: season,
                    content: [
                        { 'department': '军需股', 'names': jx[0].season4, '_id': jx[0]._id },
                        { 'department': '油料股', 'names': yl[0].season4, '_id': yl[0]._id },
                        { 'department': '运输股', 'names': ys[0].season4, '_id': ys[0]._id },
                        { 'department': '机场营房股', 'names': jy[0].season4, '_id': jy[0]._id },
                        { 'department': '航材军械股', 'names': hj[0].season4, '_id': hj[0]._id },
                        { 'department': '飞行管制室', 'names': fxgzs[0].season4, '_id': fxgzs[0]._id },
                        { 'department': '气象台', 'names': qxt[0].season4, '_id': qxt[0]._id },
                        { 'department': '医院', 'names': yy[0].season4, '_id': yy[0]._id },
                        { 'department': '通信导航连', 'names': td[0].season4, '_id': td[0]._id },
                        { 'department': '警卫连', 'names': jw[0].season4, '_id': jw[0]._id },
                        { 'department': '汽车连', 'names': qc[0].season4, '_id': qc[0]._id },
                        { 'department': '场务连', 'names': cwl[0].season4, '_id': cwl[0]._id },
                        { 'department': '四站连', 'names': sz[0].season4, '_id': sz[0]._id }
                    ]
                })
            }

        }
    )

})

module.exports = router