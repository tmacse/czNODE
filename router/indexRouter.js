const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const NoticeModel = require('../model/NoticeModel.js');
const DepartmentMessageModel = require('../model/DepartmentMessageModel');
const VideoModel = require('../model/VideoModel');
const PicShowModel = require('../model/PicShowModel');
const LeaderModel = require('../model/LeaderModel');
var moment = require('moment')


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

router.get('/homedata', (req, res) => {
    //强军阶梯栏目左边的精品课程，最多显示6个
    const curriculumlist = ArticleModel.find({ "category": '精品课程' })
        .sort({ date_time: -1 }).limit(6)
    //第一层栏目中右边的通知列表
    const noticelist = NoticeModel.find()
        .sort({ date_time: -1 }).limit(10)
    //强军阶梯栏目中间的案例分析列表
    const casebooklist = ArticleModel.find({ "category": '案例分析' })
        .sort({ date_time: -1 }).limit(6)
    //活动概况列表（包括左侧图片展示和右侧文字展示）
    const summarylist = ArticleModel.find({ "category": '活动概况' }).find({ thumbnail: { $exists: true, $ne: [] } })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中部队管理办的消息列表
    const governmentlist = DepartmentMessageModel.find({ "department": "部队管理办" })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中战勤办的消息列表
    const trainlist = DepartmentMessageModel.find({ 'department': '战勤办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中组织办的消息列表
    const organizationlist = DepartmentMessageModel.find({ 'department': '组织办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中宣传保卫办的消息列表
    const propagationlist = DepartmentMessageModel.find({ 'department': '宣传保卫办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军动态中人力资源办的消息列表
    const manpowerlist = DepartmentMessageModel.find({ 'department': '人力资源办' })
        .sort({ date_time: -1 }).limit(6)
    //获取强军文化中强军影视的消息列表
    const movielist = VideoModel.find({ "attr": '强军影视' }).sort({ date_time: -1 }).limit(6)
    //获取强军文化中练兵备战的消息列表
    const videolist = VideoModel.find({ "attr": "练兵备战" }).sort({ date_time: -1 }).limit(6)
    //获取强军文化中创意视频的消息列表
    const vloglist = VideoModel.find({ "attr": "创意视频" }).sort({ date_time: -1 }).limit(6)
    //获取强军新闻的列表
    const videoNewslist = VideoModel.find({ "attr": '强军新闻' }).sort({ date_time: -1 }).limit(1)
    //获取各个小单位新闻的列表
    const jwNewslist = ArticleModel.find({ "category": '活动概况' }).find({ thumbnail: { $exists: true, $ne: [] } }).find({ "department": '警卫连' })
        .sort({ date_time: -1 }).limit(12)
    //获取强军风采的图片所在的列表
    const picShow = PicShowModel.find().sort({ date_time: -1 }).limit(7)
    //获取强军政策的图片的列表
    const qjPolicy = ArticleModel.find({ "category": '强军政策' })
        .sort({ date_time: -1 }).limit(14)
    //获取首长和参谋的名字
    const leaderName = LeaderModel.find().sort({ date_time: -1 }).limit(1)

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
//获取百部电影的界面和基层微视频
router.get('/historylist', async (req, res) => {
    //获取百部电影
    const historylist = await VideoModel.find({ "attr": '强军影视' }).sort({ date_time: -1 }).limit(6)
    const minivlog = await VideoModel.find({ "attr": "创意视频" }).sort({ date_time: -1 }).limit(6)
    Promise.all(
        [historylist, minivlog]
    ).then(
        (result) => {
            res.send({
                success: true,
                data: {
                    'historylist': result[0],
                    'minivlog': result[1]
                }
            })
        }
    )
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
//获取统计各个单位新闻的接口
router.get('/statistics', async (req, res) => {
    //mongodb的聚合操作，通过查询可直接根据月份排序，返回的结果如下
    // 统计各个单位总稿件量
    const departmentList = await ArticleModel.aggregate([
        { $match: { category: '活动概况' } },
        {
            $group: { _id: { department: "$department" }, count: { $sum: 1 } }//根据单位来group分类
        }
    ])
    const CountByMonthList = await ArticleModel.aggregate([
        { $match: { category: '活动概况' } },
        { $project: { month: { $substr: ["$time", 0, 7] }, department: "$department" } },
        { $group: { _id: { department: "$department", month: "$month" }, count: { $sum: 1 } } }
    ])
    //定义本月的月份
    const this_month = moment().format('YYYY/MM')
    // 定义下个月的月份
    const last_month = moment().subtract(1, 'months').format('YYYY/MM')
    // 生成上月的list
    let lastMonth = []
    CountByMonthList.map(item => {
        if (item._id.month == last_month) {
            lastMonth.push(item)
        }
    })
    // 生成本月的list
    let thisMonth = []
    CountByMonthList.map(item => {
        if (item._id.month == this_month) {
            thisMonth.push(item)
        }
    })
    console.log(departmentList)
    Promise.all(
        [departmentList, thisMonth, lastMonth]
    )
        .then((result) => {
            //生成hashTable,包括所有单位的deparment,其中将total设置为0
            let hashTable = []
            BASE_ALL_TUPLE_DEPARTMENT.slice(3).forEach((obj) => {
                console.log(obj)
                hashTable.push({ _id: obj.name, name: obj.Cname, total: 0, last_month: 0, this_month: 0 })
            })
            //循环更改departmentList里面的值
            for (let i = 0; i < departmentList.length; i++) {
                let temp = (departmentList[i]._id).department //获取到归类后的单位的值
                hashTable.forEach((obj) => {
                    if (obj.name === temp) {
                        obj.total = departmentList[i].count
                    }
                }
                )
            }

            //循环更改本月的数量
            for (let i = 0; i < thisMonth.length; i++) {
                let temp = thisMonth[i]._id.department
                hashTable.forEach((obj) => {
                    if (obj.name === temp) {
                        obj.this_month = thisMonth[i].count
                    }
                })
            }
            // 接下来要写的地方
            for (let i = 0; i < lastMonth.length; i++) {
                let temp = lastMonth[i]._id.department
                hashTable.forEach((obj) => {
                    if (obj.name === temp) {
                        obj.last_month = lastMonth[i].count
                    }
                })
            }
            res.send({
                // hashTable是十四个单位的值
                data: hashTable
            })
        })
        .catch()


})
module.exports = router