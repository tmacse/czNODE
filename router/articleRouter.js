const express = require('express');
const passport = require('../utils/passport.js')
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');

//添加文章（包括精品课程、案列分析和活动概况的总体路由）
router.post('/add', (req, res) => {
    let { title, author, department, thumbnail, category, content } = req.body
    console.log(req.body)
    //判断上述字段都不能为空
    if (title && author && department && thumbnail && category && content) {
        ArticleModel.find({ title }).then((data) => {
            if (data.length === 0) {
                //文章不存在，可以添加
                return ArticleModel.insertMany({ title, author, department, thumbnail, category, content })
            } else {
                res.send({ err: -3, msg: '文章已经存在' })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加文章成功' })
        }).catch(() => {
            res.send({ err: -2, msg: '添加文章失败' })
        })
    } else {
        return res.send({ err: -1, msg: '参数错误' })

    }

})
//更新文章(此处为更新文章，必然获取文章的ID)?????有问题
router.post('/update', (req, res) => {
    const article = req.body;
    console.log(article._id)
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            ArticleModel.findOneAndUpdate({ _id: article._id }, article)
                .then(() => {
                    res.send({ err: 0, msg: '更新成功' })
                }).catch((err) => {
                    // console.error('更新商品异常', err)
                    res.send({ err: -1, msg: '更新失败' })
                })
        } else {
            res.send({ err: -999, msg: '没有该权限' })
        }
    }


})
//更新文章状态
router.post('/updateStatus', (req, res) => {
    const { title } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            ArticleModel.findOneAndUpdate({ title: title }, { ischecked: true })
                .then((oldarticle) => {
                    res.send({ err: 0, msg: '更新文章成功', data: oldarticle })
                }).catch((error) => {
                    console.log(error)
                    res.send({ err: 1, msg: '更新文章状态异常, 请重新尝试' })

                })
        } else {
            res.send({ err: -999, msg: '没有该权限' })
        }
    }


})
//更新文章状态shangtoutiao
router.post('/updateStatusToTop', (req, res) => {
    const { title } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            ArticleModel.findOneAndUpdate({ title: title }, { isToped: true })
                .then((oldarticle) => {
                    res.send({ err: 0, msg: '更新成功', data: oldarticle })
                }).catch((error) => {
                    console.log(error)
                    res.send({ err: 1, msg: '更新文章状态异常, 请重新尝试' })

                })
        } else {
            res.send({ err: -999, msg: '没有权限' })
        }
    }


})
//更新文章状态下头条
router.post('/updateStatusToDown', (req, res) => {
    const { title } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            ArticleModel.findOneAndUpdate({ title: title }, { isToped: false })
                .then((oldarticle) => {
                    res.send({ err: 0, msg: '更新成功', data: oldarticle })
                }).catch((error) => {
                    console.log()
                    res.send({ err: 1, msg: '更新文章状态异常, 请重新尝试' })

                })
        } else {
            res.send({ err: -999, msg: '没有权限' })
        }
    }


})


//查询文章（依照文章标题或者内容）
router.post('/search', (req, res) => {
    let { kw } = req.body
    console.log(kw)
    let reg = new RegExp(kw)
    ArticleModel.find({ $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] }).sort({ date_time: -1 })
        .then((data) => {
            res.send({ err: 0, msg: '查询成功', list: data })
        }).catch((err) => {
            console.log(err)
            res.send({ err: -1, msg: '查询失败' })
        })
})

//删除文章(根据文章名字删除文章)
router.post('/delete', (req, res) => {
    const { title } = req.body
    if (typeof req.session.passport === 'undefined') {
        res.send({ err: -888, msg: '未登陆' })
    } else {
        if (req.session.passport.user.username === 'admin') {
            ArticleModel.deleteOne({ title: title }).then(() => {
                res.send({ err: 0, msg: '删除文章成功' })
            }).catch(() => {
                res.send({ err: -1, msg: '删除文章失败' })

            })
        } else {
            res.send({ err: -999, msg: '没有此权限' })
        }
    }


})
//实现查询分页功能
router.post('/getArticleByPage', (req, res) => {
    let pageSize = req.body.pageSize || 5 //设置为默认值显示5个
    let pageNumber = req.body.pageNumber || 1 //设置为默认值显示第一页
    ArticleModel.find({ ischecked: false }).sort({ date_time: -1 }).limit(Number(pageSize)).skip(Number((pageNumber - 1) * pageSize))
        .then((data) => {
            res.send({ err: 0, msg: '查询成功', list: data })
        }).catch((err) => {
            res.send({ err: -1, msg: '查询失败' })
        })
})
//获取文章列表(首页显示新闻数量)
router.get('/getList', (req, res) => {
    // let num = req.query.num

    //按时间倒序排列呈现通知（后台指定显示12条新闻）
    ArticleModel.find().sort({ date_time: -1 }).limit(Number(10)).then((data) => { res.send({ err: 0, msg: 'ok', list: data }) })
        .catch((err) => {
            console.log(err)
            res.send({ err: -1, msg: 'wrong' })
        })
})
// 获取文章分页列表（未经过审核的）
router.get('/list', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ ischecked: false }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
//获取文章分页列表（已经审核过的）
router.get('/checkedlist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
//获取文章分页列表（已经审核过的）
router.get('/checkedtoplist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ isToped: true }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
router.get('/search', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        articleTitle,
        articleContent,
        articleAuthor,
        articleDepartment,
        articleCategory
    } = req.query
    let contition = {}
    if (articleTitle) {
        contition = {
            title: new RegExp(`^.*${articleTitle}.*$`)
        }
    } else if (articleContent) {
        contition = {
            content: new RegExp(`^.*${articleContent}.*$`)
        }
    }
    else if (articleAuthor) {
        contition = {
            author: new RegExp(`^.*${articleAuthor}.*$`)
        }
    }
    else if (articleDepartment) {
        contition = {
            department: new RegExp(`^.*${articleDepartment}.*$`)
        }
    }
    else if (articleCategory) {
        contition = {
            category: new RegExp(`^.*${articleCategory}.*$`)
        }
    }
    ArticleModel.find(contition).find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
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

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}
//获取新闻总量
router.get('/totalNum', (req, res) => {
    ArticleModel.find({ ischecked: true }).countDocuments()
        .then((total) => {
            res.send({ status: 0, totalArticles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
const LVZHI = [
    { department: '组织科' }, { department: '宣传科' }, { department: '人力资源科' }, { department: '纪检检查科' }, { department: '保卫科' },
    { department: '训练科' }, { department: '部队管理科' },
]
const KONGQIN = [{ department: '飞行一大队' }, { department: '飞行二大队' }, { department: '飞行三大队' }, { department: '空中战勤大队' }]
const JIWU = [{ department: '机务一中队' }, { department: '机务二中队' }, { department: '机务三中队' }, { department: '机务大队部' }]
const CHANGZHAN = [{ department: '运输股' }, { department: '汽车连' }, { department: '警卫连' }]
//获取旅直总量
router.get('/lvzhinews', (req, res) => {
    ArticleModel.find({ ischecked: true }).find({ $or: LVZHI }).countDocuments()
        .then((total) => {
            res.send({ status: 0, totalLvzhiArticles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
router.get('/kongqinnews', (req, res) => {
    ArticleModel.find({ ischecked: true }).find({ $or: KONGQIN }).countDocuments()
        .then((total) => {
            res.send({ status: 0, totalKongqinArticles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
router.get('/changzhannews', (req, res) => {
    ArticleModel.find({ ischecked: true }).find({ $or: CHANGZHAN }).countDocuments()
        .then((total) => {
            res.send({ status: 0, totalChangzhanArticles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
router.get('/jiwunews', (req, res) => {
    ArticleModel.find({ ischecked: true }).find({ $or: JIWU }).countDocuments()
        .then((total) => {
            res.send({ status: 0, totalJiwuArticles: total })
        }).catch((error) => {
            res.send({ status: 1, msg: 'error' })
        })
})
//旅直
router.get('/lvzhisearch', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        articleTitle,
        articleContent,
        articleAuthor,
        articleDepartment,
        articleCategory
    } = req.query
    let contition = {}
    if (articleTitle) {
        contition = {
            title: new RegExp(`^.*${articleTitle}.*$`)
        }
    } else if (articleContent) {
        contition = {
            content: new RegExp(`^.*${articleContent}.*$`)
        }
    }
    else if (articleAuthor) {
        contition = {
            author: new RegExp(`^.*${articleAuthor}.*$`)
        }
    }
    else if (articleDepartment) {
        contition = {
            department: new RegExp(`^.*${articleDepartment}.*$`)
        }
    }
    else if (articleCategory) {
        contition = {
            category: new RegExp(`^.*${articleCategory}.*$`)
        }
    }
    ArticleModel.find(contition).find({ $or: LVZHI }).find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
        })
})
router.get('/lvzhicheckedlist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }, { $or: LVZHI }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
router.get('/kongqinsearch', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        articleTitle,
        articleContent,
        articleAuthor,
        articleDepartment,
        articleCategory
    } = req.query
    let contition = {}
    if (articleTitle) {
        contition = {
            title: new RegExp(`^.*${articleTitle}.*$`)
        }
    } else if (articleContent) {
        contition = {
            content: new RegExp(`^.*${articleContent}.*$`)
        }
    }
    else if (articleAuthor) {
        contition = {
            author: new RegExp(`^.*${articleAuthor}.*$`)
        }
    }
    else if (articleDepartment) {
        contition = {
            department: new RegExp(`^.*${articleDepartment}.*$`)
        }
    }
    else if (articleCategory) {
        contition = {
            category: new RegExp(`^.*${articleCategory}.*$`)
        }
    }
    ArticleModel.find(contition).find({ $or: KONGQIN }).find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
        })
})
router.get('/kongqincheckedlist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }, { $or: KONGQIN }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
router.get('/changzhansearch', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        articleTitle,
        articleContent,
        articleAuthor,
        articleDepartment,
        articleCategory
    } = req.query
    let contition = {}
    if (articleTitle) {
        contition = {
            title: new RegExp(`^.*${articleTitle}.*$`)
        }
    } else if (articleContent) {
        contition = {
            content: new RegExp(`^.*${articleContent}.*$`)
        }
    }
    else if (articleAuthor) {
        contition = {
            author: new RegExp(`^.*${articleAuthor}.*$`)
        }
    }
    else if (articleDepartment) {
        contition = {
            department: new RegExp(`^.*${articleDepartment}.*$`)
        }
    }
    else if (articleCategory) {
        contition = {
            category: new RegExp(`^.*${articleCategory}.*$`)
        }
    }
    ArticleModel.find(contition).find({ $or: CHANGZHAN }).find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
        })
})
router.get('/changzhancheckedlist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }, { $or: CHANGZHAN }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
router.get('/jiwusearch', (req, res) => {
    const {
        pageNum,
        pageSize,
        searchName,
        articleTitle,
        articleContent,
        articleAuthor,
        articleDepartment,
        articleCategory
    } = req.query
    let contition = {}
    if (articleTitle) {
        contition = {
            title: new RegExp(`^.*${articleTitle}.*$`)
        }
    } else if (articleContent) {
        contition = {
            content: new RegExp(`^.*${articleContent}.*$`)
        }
    }
    else if (articleAuthor) {
        contition = {
            author: new RegExp(`^.*${articleAuthor}.*$`)
        }
    }
    else if (articleDepartment) {
        contition = {
            department: new RegExp(`^.*${articleDepartment}.*$`)
        }
    }
    else if (articleCategory) {
        contition = {
            category: new RegExp(`^.*${articleCategory}.*$`)
        }
    }
    ArticleModel.find(contition).find({ $or: JIWU }).find({ $and: [{ ischecked: true }, { isToped: false }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('搜索文章列表异常', error)
            res.send({
                status: 1,
                msg: '搜索文章列表异常, 请重新尝试'
            })
        })
})
router.get('/jiwucheckedlist', (req, res) => {
    const {
        pageNum,
        pageSize
    } = req.query
    ArticleModel.find({ $and: [{ ischecked: true }, { isToped: false }, { $or: JIWU }] }).sort({ date_time: -1 })
        .then(articles => {
            res.send({
                status: 0,
                data: pageFilter(articles, pageNum, pageSize)
            })
        })
        .catch(error => {
            console.error('获取文章列表异常', error)
            res.send({
                status: 1,
                msg: '获取文章列表异常, 请重新尝试'
            })
        })
})
module.exports = router