const express = require('express');
const router = express.Router();
//这是一个前段获取界面的router
const ArticleModel = require('../model/ArticleModel');
const BannerPicModel = require('../model/BannerPicModel.js');
const BookFileModel = require('../model/BookFileModel.js');
const NoticeModel = require('../model/NoticeModel.js');
const SoftwareModel = require('../model/SoftwareModel.js');
const DepartmentMessageModel  = require('../model/DepartmentMessageModel.js');
const VideoModel = require('../model/VideoModel.js')
const MusicModel = require('../model/MusicModel.js')
const PicShowModel = require('../model/PicShowModel.js')

// router.get('/qjsx',async(req,res)=>{
//     const jhxbcontent=await BookFileModel.find({title:'习主席讲话选编'})
//     const sdjdcontent = await BookFileModel.find({ title: '习主席讲话深度解读' })
//     const ztjycontent = await BookFileModel.find({ title: '强军思想内主题教育' })

//     Promise.all([jhxbcontent,sdjdcontent,ztjycontent]).then((result)=>{
//         console.log(result)
//         res.send({
//             err:0,
//             data:{
//                 'jhxbcontent':result[0],
//                 'sdjdcontent':result[1],
//                 'ztjycontent':result[2],
//             }
//         })
//     }).catch((err)=>{
//         console.log(err)
//     })

// })
router.get('/jhxb',async(req,res)=>{
    BookFileModel.find({title:'习主席讲话选编'}).then((data)=>{
        res.send({err:0,data:data})
    }).catch((error)=>{
        console.log(error)
    })
})
router.get('/sdjd', async (req, res) => {
    BookFileModel.find({ title: '习主席讲话深度解读' }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((error) => {
        console.log(error)
    })
})
router.get('/ztjy', async (req, res) => {
    BookFileModel.find({ title: '强军思想内主题教育' }).then((data) => {
        res.send({ err: 0, data: data })
    }).catch((error) => {
        console.log(error)
    })
})

router.get('/homedata',async(req,res)=>{
    
    const LVZHI = [
        { department: '组织科' }, { department: '宣传科' }, 
        { department: '人力资源科' },{ department: '纪检监察科' }, { department: '保卫科' },
        {department:'航行规划科'}, {department:'训练科'}, {department:'信息保障科'}, {department:'部队管理科'},
        {department:'战勤计划科'}, {department:'指挥控制室'}, {department:'教学保障室'},
    ]
    const KONGQIN = [{department:'飞行一大队'},{department:'飞行二大队'},
                    {department:'飞行三大队'},{department:'空中战勤大队'}]
    const JIWU = [{department:'机务一中队'},{department:'机务二中队'},
                    {department:'机务三中队'},{department:'修理厂'},{department:'机务大队部'}]
    const CHANGZHAN = [{department:'场站参谋部'}, {department:'场站政治工作处'},
                        {department:'财务股'}, {department:'军需股'}, {department:'油料股'}, 
                        {department:'运输股'}, {department:'机场营房股'}, 
                        {department:'航材军械股'}, {department:'飞行管制室'}, 
                        {department:'气象台'}, {department:'医院'},
                        {department:'通信导航连'}, {department:'警卫连'}, 
                        {department:'汽车连'}, {department:'场务连'}, {department:'四站连'}] 
    const slvzhipics = await ArticleModel.find({ $or: LVZHI }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(2)
    const blvzhipics = await ArticleModel.find({ $or: LVZHI }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).limit(1)
    const carouselpics = await ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }, { thumbnail: { $exists: true, $ne: [] }}] }).sort({ date_time:-1 }).limit(10)//滚动大屏幕，显示10个
    const newslist = await ArticleModel.find({$and:[{ ischecked: true }, { isToped: false }]}).sort({date_time:-1}).limit(12)//左侧新闻栏目，显示12个
    const noticelist = await NoticeModel.find().sort({date_time:-1}).limit(10)//通知栏目，只显示最近半年的通知（暂时只显示10个）
    const lvzhinewsleftlist = await ArticleModel.find({$or:LVZHI}).sort({date_time:-1}).limit(5)//（是否）显示最新的5个
    const lvzhinewsrightlist = await ArticleModel.find({$or:LVZHI}).sort({date_time:-1}).skip(5).limit(5)//除掉
    const kongqinnewsleftlist = await ArticleModel.find({$or:KONGQIN}).sort({date_time:-1}).limit(1)
    const kongqinnewsrightlist = await ArticleModel.find({ $or: KONGQIN }).sort({ date_time:-1 }).skip(1).limit(1)
    const jiwunewsleftlist = await ArticleModel.find({$or:JIWU}).sort({date_time:-1}).limit(1)
    const jiwunewsrightlist = await ArticleModel.find({ $or: JIWU}).sort({date_time:-1}).skip(1).limit(1)
    const changzhannewsleftlist = await ArticleModel.find({$or :CHANGZHAN}).sort({date_time:-1}).limit(1)
    const changzhannewsrightlist = await ArticleModel.find({$or:CHANGZHAN}).sort({date_time:-1}).skip(1).limit(1)
    const secondleftlist = await BookFileModel.find().sort({date_time:-1}).limit(9)//此处为政工教案，只显示最新的9个
    const secondmiddlelist = await VideoModel.find().sort({date_time:-1}).limit(5)//
    const secondrightlist = await PicShowModel.find().sort({date_time:-1}).limit(4)//
    const thirdleftlist = await MusicModel.find().sort({ date_time:-1 }).limit(6)//第三板块左边
    const thirdmiddlelist = await BookFileModel.find().sort({ date_time:-1 }).skip(4).limit(4)//第三板块中间
    const thirdrightlist = await BookFileModel.find().sort({ date_time:-1 }).skip(5).limit(5)//第三板块右边
    const softdownleftlist = await SoftwareModel.find().sort({date_time:-1}).limit(8)
    const softdownrightlist = await SoftwareModel.find().sort({date_time:-1}).skip(8).limit(8)
    const zuzhilistleft = await DepartmentMessageModel.find({department:'组织科'}).sort({date_time:-1}).limit(5)
    const zuzhilistmiddle = await DepartmentMessageModel.find({ department: '组织科' }).sort({ date_time:-1 }).skip(5).limit(5)
    const zuzhilistright = await DepartmentMessageModel.find({ department: '组织科' }).sort({ date_time:-1 }).skip(10).limit(5)
    const renlilistleft = await DepartmentMessageModel.find({ department: '人力资源科' }).sort({ date_time:-1 }).limit(5)
    const renlilistmiddle = await DepartmentMessageModel.find({ department: '人力资源科' }).sort({ date_time:-1 }).skip(5).limit(5)
    const renlilistright = await DepartmentMessageModel.find({ department: '人力资源科' }).sort({ date_time:-1 }).skip(10).limit(5)
    const xuanchuanlistleft = await DepartmentMessageModel.find({department: '宣传科' }).sort({ date_time:-1 }).limit(5)
    const xuanchuanlistmiddle = await DepartmentMessageModel.find({ department: '宣传科' }).sort({ date_time:-1 }).skip(5).limit(5)
    const xuanchuanlistright = await DepartmentMessageModel.find({ department: '宣传科' }).sort({ date_time:-1 }).skip(10).limit(5)
    const jijianlistleft = await DepartmentMessageModel.find({ department: '纪检监察科' }).sort({ date_time:-1 }).limit(5)
    const jijianlistmiddle = await DepartmentMessageModel.find({ department: '纪检监察科' }).sort({ date_time:-1 }).skip(5).limit(5)
    const jijianlistright = await DepartmentMessageModel.find({ department: '纪检监察科' }).sort({ date_time:-1 }).skip(10).limit(5)
    const baoweilistleft = await DepartmentMessageModel.find({ department: '保卫科' }).sort({ date_time:-1 }).limit(5)
    const baoweilistmiddle = await DepartmentMessageModel.find({ department: '保卫科' }).sort({ date_time:-1 }).skip(5).limit(5)
    const baoweilistright = await DepartmentMessageModel.find({ department: '保卫科' }).sort({ date_time:-1 }).skip(10).limit(5)
    const navcarouselpics = await BannerPicModel.find().sort({time:-1}).limit(5)//获得nav长的banner图片
    const bkongqinpics = await ArticleModel.find({ $or: KONGQIN }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(1)
    const skongqinpics = await ArticleModel.find({ $or: KONGQIN }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(2)
    const bjiwupics = await ArticleModel.find({ $or: JIWU }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(1)
    const sjiwupics = await ArticleModel.find({ $or: JIWU }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(2)
    const bchangzhanpics = await ArticleModel.find({ $or: CHANGZHAN }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(1)
    const schangzhanpics = await ArticleModel.find({ $or: CHANGZHAN }).find({ thumbnail: { $exists: true, $ne: [] } }).sort({ date_time:-1 }).skip(1).limit(2)
    const bigcarousel = await ArticleModel.find({isToped:true}).limit(5)

    Promise.all(
            [slvzhipics,
            blvzhipics,
            carouselpics,
            newslist,
            noticelist,
            lvzhinewsleftlist,
            lvzhinewsrightlist,
            kongqinnewsleftlist,
            kongqinnewsrightlist,
            jiwunewsleftlist,
            jiwunewsrightlist,
            changzhannewsleftlist,
            changzhannewsrightlist,
            secondleftlist,
            secondmiddlelist,
            secondrightlist,
            thirdleftlist,
            thirdmiddlelist,
            thirdrightlist,
            softdownleftlist,
            softdownrightlist,
            zuzhilistleft,
            zuzhilistmiddle,
            zuzhilistright,
            renlilistleft,
            renlilistmiddle,
            renlilistright,
            xuanchuanlistleft,
            xuanchuanlistmiddle,
            xuanchuanlistright,
            jijianlistleft,
            jijianlistmiddle,
            jijianlistright,
            baoweilistleft,
            baoweilistmiddle,
            baoweilistright,
            navcarouselpics,
            bkongqinpics,
            skongqinpics,
            bjiwupics,
            sjiwupics,
            bchangzhanpics,
            schangzhanpics,
            bigcarousel,
            ]
        ).then((result)=>{
       res.send(
           { success: true,
            data:{
                'slvzhipics':result[0],
                'blvzhipics':result[1],
                'carouselpics':result[2],
                'newslist':result[3],
                'noticelist':result[4],
                'lvzhinewsleftlist':result[5],
                'lvzhinewsrightlist':result[6],
                'kongqinnewsleftlist':result[7],
                'kongqinnewsrightlist':result[8],
                'jiwunewsleftlist':result[9],
                'jiwunewsrightlist':result[10],
                'changzhannewsleftlist':result[11],
                'changzhannewsrightlist':result[12],
                'secondleftlist':result[13],
                'secondmiddlelist':result[14],
                'secondrightlist':result[15],
                'thirdleftlist':result[16],
                'thirdmiddlelist':result[17],
                'thirdrightlist':result[18],
                'softdownleftlist':result[19],
                'softdownrightlist':result[20],
                'zuzhilistleft':result[21],
                'zuzhilistmiddle':result[22],
                'zuzhilistright':result[23],
                'renlilistleft': result[24],
                'renlilistmiddle': result[25],
                'renlilistright': result[26],
                'xuanchuanlistleft': result[27],
                'xuanchuanlistmiddle': result[28],
                'xuanchuanlistright': result[29],
                'jijianlistleft': result[30],
                'jijianlistmiddle': result[31],
                'jijianlistright': result[32],
                'baoweilistleft': result[33],
                'baoweilistmiddle': result[34],
                'baoweilistright': result[35],
                'navcarouselpics':result[36],
                'bkongqinpics':result[37],
                'skongqinpics':result[38],
                'bjiwupics':result[39],
                'sjiwupics':result[40],
                'bchangzhanpics':result[41],
                'schangzhanpics':result[42],
                'bigcarousel':result[43],

        }})
   })
}
   
)
router.get('/getNewsByID',(req,res)=>{
    const {_id} = req.query
    console.log(_id)
    
    ArticleModel.find({_id:_id}).then((data)=>{
        res.send({err:0,data:data})
    }).catch((err)=>{
        console.log(err)
    })
})
//获取通知详情页面
router.get('/getBookFileByID',(req,res)=>{
    const {_id} = req.query
    BookFileModel.find({_id:_id}).then((data)=>{
        res.send({err:0,data:data})
    }).catch((err)=>{
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
router.get('/getNoticeByID', (req, res) => {
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
router.get('/getIntroduction',(req,res)=>{
    ArticleModel.findOne({title:'五旅简介'}).then((data)=>{
        res.send({err:0,data:data})
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