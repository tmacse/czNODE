const express = require('express');
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');
const NoticeModel = require('../model/NoticeModel.js');
//这是一个前段获取界面的router

router.get('/homedata', async (req, res) => {
    const newslist = await ArticleModel.find(
        { $and: [{ ischecked: true }, { isToped: false }] })
        .sort({ date_time: -1 }).limit(12)//左侧新闻栏目，显示12个
    const noticelist = await NoticeModel.find().sort({ date_time: -1 })
        .limit(10)//通知栏目，只显示最近半年的通知（暂时只显示10个）

    Promise.all(
        [newslist, noticelist,]
    ).then((result) => {
        res.send(
            {
                success: true,
                data: {
                    'newslist': result[0],
                    'noticelist': result[1],
                }
            })
    })
}

)
router.get('/getNewsByID', (req, res) => {
    const { _id } = req.query
    console.log(_id)

    ArticleModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})
//获取通知详情页面
router.get('/BookFileByID', (req, res) => {
    const { _id } = req.query
    console.log(_id)
    BookFileModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})
//获取科室动态详情页面
router.get('/getDepartmentByID', (req, res) => {
    const { _id } = req.query
    DepartmentMessageModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})
//获取通知详情页面
router.get('/NoticeByID', (req, res) => {
    const { _id } = req.query
    NoticeModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})
//获取picshow
router.get('/getPicShowByID', (req, res) => {
    const { _id } = req.query
    PicShowModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((err) => {
        console.log(err)
    })
})
router.get('/getSoftwareByID', (req, res) => {
    const { _id } = req.query
    SoftwareModel.find({ _id: _id }).then((data) => {
        res.send({ err: 0, data: data })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
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