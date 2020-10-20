const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const DepartmentMessageModel = require('../model/DepartmentMessageModel');
const NoticeModel = require('../model/NoticeModel.js');
const VideoModel = require('../model/VideoModel');

const LIST = [['curriculum', 'ArticleModel'], ['notices', 'NoticeModel']]

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
    VideoModel.find().sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => {
            res.send({ status: 1, msg: '获取列表异常, 请重新尝试' })
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
