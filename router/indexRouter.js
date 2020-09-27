const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const NoticeModel = require('../model/NoticeModel.js');
//这是一个前段获取界面的router

router.get('/homedata', async (req, res) => {
    //强军阶梯栏目左边的精品课程，最多显示6个
    const curriculumlist = await ArticleModel.find({ "category": '精品课程' }).sort({ date_time: -1 }).limit(6)
    //第一层栏目中右边的通知列表
    const noticelist = await NoticeModel.find().sort({ date_time: -1 }).limit(6)
    //强军阶梯栏目中间的案例分析列表
    const casebooklist = await ArticleModel.find({ "category": '案例分析' }).sort({ date_time: -1 }).limit(6)
    //活动概况列表（包括左侧图片展示和右侧文字展示）
    const summarylist = await ArticleModel.find({ "category": '活动概况' }).sort({ date_time: -1 }).limit(6)
    Promise.all(
        [curriculumlist, noticelist, casebooklist, summarylist]
    ).then((result) => {
        res.send(
            {
                success: true,
                data: {
                    'curriculumlist': result[0],
                    'noticelist': result[1],
                    'casebooklist': result[2],
                    'summarylist': result[3],
                }
            })
    })
}
)


//获取详情页面（包括通知，精品课程，案列分析，活动概况等）
router.get('/ByID', (req, res) => {
    const { _id } = req.query
    const modelList = [ArticleModel, NoticeModel]
    for (let i = 0; i < 2; i++) {
        modelList[i].find({ _id: _id }).then((data) => {
            //判定data是否是空数组，如果是空数组，不执行，将不是空数组的结果data推送至前端
            if (JSON.stringify(data) === '[]') {
                console.log('11111')
            }
            else {
                console.log(data)
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
//获取音乐地址
router.get('/getMusicByID', (req, res) => {
    const { _id } = req.query
    MusicModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
})
//获取五旅简介
router.get('/getIntroduction', (req, res) => {
    ArticleModel.findOne({ title: '五旅简介' }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)

    })
})
//

router.get('/getFrontHistory', (req, res) => {
    ArticleModel.findOne({ title: '历史前沿' }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)

    })
})
//获取强军思想内习主席讲话选编
router.get('/getJhxb', (req, res) => {
    BookFileModel.findOne({ title: '习主席讲话选编' }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)

    })
})
//获取强军思想内深度解读
router.get('/getSdjd', (req, res) => {
    BookFileModel.findOne({ title: '习主席讲话深度解读' }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)

    })
})
router.get('/getZtjy', (req, res) => {
    BookFileModel.findOne({ title: '强军思想内主题教育' }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)

    })
})




module.exports = router