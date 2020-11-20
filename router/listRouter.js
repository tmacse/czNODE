const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const DepartmentMessageModel = require('../model/DepartmentMessageModel');
const NoticeModel = require('../model/NoticeModel.js');
const VideoModel = require('../model/VideoModel');



//获取精品课程分页列表
router.get('/curriculum', (req, res) => {
    const { pageNum, pageSize } = req.query
    ArticleModel.find({ 'category': '精品课程' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, msg: '获取列表异常, 请重新尝试' }) })
})
//获取通知分页列表
router.get('/notices', (req, res) => {
    const { pageNum, pageSize } = req.query
    NoticeModel.find().sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获取案例分析列表
router.get('/case', (req, res) => {
    const { pageNum, pageSize } = req.query
    ArticleModel.find({ 'category': '案例分析' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获得活动概况的分析列表
router.get('/symposia', (req, res) => {
    const { pageNum, pageSize } = req.query
    ArticleModel.find({ 'category': '活动概况' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获得强军动态的列表
router.get('/dynamic', (req, res) => {
    const { pageNum, pageSize } = req.query
    DepartmentMessageModel.find().sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获得强军影视的列表
router.get('/movie', (req, res) => {
    const { pageNum, pageSize } = req.query
    VideoModel.find({ 'attr': '强军影视' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获得练兵备战的列表
router.get('/video', (req, res) => {
    const { pageNum, pageSize } = req.query
    VideoModel.find({ 'attr': '练兵备战' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获得创意视频的列表
router.get('/vlog', (req, res) => {
    const { pageNum, pageSize } = req.query
    VideoModel.find({ 'attr': '创意视频' }).sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
        })
})
//获取强军新闻（视频）的列表
router.get('/newsMovie', (req, res) => {
    const { pageSize, pageNum } = req.query
    VideoModel.find({ 'attr': '强军新闻' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
})
//获得部队管理办的列表
router.get('/goverment', (req, res) => {
    const { pageSize, pageNum } = req.query
    DepartmentMessageModel.find({ 'department': '部队管理办' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
})
//获得训练办的列表
router.get('/train', (req, res) => {
    const { pageSize, pageNum } = req.query
    DepartmentMessageModel.find({ 'department': '战勤办' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
})
//获得组织办的列表
router.get('/organization', (req, res) => {
    const { pageSize, pageNum } = req.query
    DepartmentMessageModel.find({ 'department': '组织办' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
})
//获取人力资源办的列表
router.get('/manpower', (req, res) => {
    const { pageSize, pageNum } = req.query
    DepartmentMessageModel.find({ 'department': '人力资源办' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
})
//获取宣传保卫办的消息列表
router.get('/propagation', (req, res) => {
    const { pageSize, pageNum } = req.query
    DepartmentMessageModel.find({ 'department': '宣传保卫办' }).sort({ date_time: -1 })
        .then(values => { res.send({ status: 0, data: pageFilter(values, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, error }) })
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
