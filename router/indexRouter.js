const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const NoticeModel = require('../model/NoticeModel.js');
const DepartmentMessageModel = require('../model/DepartmentMessageModel');
const VideoModel = require('../model/VideoModel');
const PicShowModel = require('../model/PicShowModel');
const LeaderModel = require('../model/LeaderModel');


//获取通知分页列表
router.get('/list', (req, res) => {
    console.log('1', req.query)
    const { pageNum } = req.query
    const pageSize = 10//先将pageSize值设定为10
    NoticeModel.find().sort({ date_time: -1 })
        .then(contents => { res.send({ status: 0, data: pageFilter(contents, pageNum, pageSize) }) })
        .catch(error => { res.send({ status: 1, msg: '获取列表异常, 请重新尝试' }) })
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
//这是一个前段获取界面的router

router.get('/homedata', async (req, res) => {
    //强军阶梯栏目左边的精品课程，最多显示6个
    const curriculumlist = await ArticleModel.find({ "category": '精品课程' })
        .sort({ date_time: -1 }).limit(6)
    //第一层栏目中右边的通知列表
    const noticelist = await NoticeModel.find()
        .sort({ date_time: -1 }).limit(10)
    //强军阶梯栏目中间的案例分析列表
    const casebooklist = await ArticleModel.find({ "category": '案例分析' })
        .sort({ date_time: -1 }).limit(6)
    //活动概况列表（包括左侧图片展示和右侧文字展示）
    const summarylist = await ArticleModel.find({ "category": '活动概况' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中部队管理办的消息列表
    const governmentlist = await DepartmentMessageModel.find({ "department": "部队管理办" })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中战勤办的消息列表
    const trainlist = await DepartmentMessageModel.find({ 'department': '战勤办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中组织办的消息列表
    const organizationlist = await DepartmentMessageModel.find({ 'department': '组织办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中宣传保卫办的消息列表
    const propagationlist = await DepartmentMessageModel.find({ 'department': '宣传保卫办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中人力资源办的消息列表
    const manpowerlist = await DepartmentMessageModel.find({ 'department': '人力资源办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军文化中强军影视的消息列表
    const movielist = await VideoModel.find({ "attr": '强军影视' }).sort({ date_time: -1 }).limit(6)
    //获取强军文化中练兵备战的消息列表
    const videolist = await VideoModel.find({ "attr": "练兵备战" }).sort({ date_time: -1 }).limit(6)
    //获取强军文化中创意视频的消息列表
    const vloglist = await VideoModel.find({ "attr": "创意视频" }).sort({ date_time: -1 }).limit(6)
    //获取强军新闻的列表
    const videoNewslist = await VideoModel.find({ "attr": '强军新闻' }).sort({ date_time: -1 }).limit(1)
    //获取各个小单位新闻的列表
    const jwNewslist = await ArticleModel.find({ "category": '活动概况' }).find({ "department": '警卫连' })
        .sort({ date_time: -1 }).limit(12)
    //获取强军风采的图片所在的列表
    const picShow = await PicShowModel.find().sort({ date_time: -1 }).limit(7)
    //获取强军政策的图片的列表
    const qjPolicy = await ArticleModel.find({ "category": '强军政策' })
        .sort({ date_time: -1 }).limit(14)
    //获取首长和参谋的名字
    const leaderName = await LeaderModel.find().sort({ date_time: -1 }).limit(1)

    Promise.all(
        [
            curriculumlist, noticelist, casebooklist, summarylist,
            governmentlist, trainlist, organizationlist, propagationlist,
            manpowerlist, movielist, videolist, vloglist, videoNewslist,
            jwNewslist, picShow, qjPolicy, leaderName
        ]
    ).then((result) => {
        res.send(
            {
                success: true,
                data: {
                    'curriculumlist': result[0],
                    'noticelist': result[1],
                    'casebooklist': result[2],
                    'summarylist': result[3],
                    'governmentlist': result[4],
                    'trainlist': result[5],
                    'organizationlist': result[6],
                    'propagationlist': result[7],
                    'manpowerlist': result[8],
                    "movielist": result[9],
                    "videolist": result[10],
                    "vloglist": result[11],
                    "videoNewslist": result[12],
                    "jwNewslist": result[13],
                    'picShow': result[14],
                    'qjPolicy': result[15],
                    'leaderName': result[16]
                }
            })
    })
})
//获取详情页面（包括通知，精品课程，案列分析，活动概况等）
router.get('/ByID', (req, res) => {
    const { _id } = req.query
    const modelList = [ArticleModel, NoticeModel, DepartmentMessageModel]
    for (let i = 0; i < modelList.length; i++) {
        modelList[i].find({ _id: _id }).then((data) => {
            //判定data是否是空数组，如果是空数组，不执行，将不是空数组的结果data推送至前端
            if (JSON.stringify(data) === '[]') {
                console.log('这是一个空值')
            }
            else {
                console.log('222', data)
                res.send({ err: 0, data: data });
            }
        })
    }
})


//获取视频地址
router.get('/getVideoByID', (req, res) => {
    const { _id } = req.query
    VideoModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
})
//获取PicShow 的地址
router.get('/getPicShowByID', (req, res) => {
    const { _id } = req.query
    console.log(_id)
    PicShowModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router