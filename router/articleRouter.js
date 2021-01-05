const express = require('express');
// const passport = require('../utils/passport.js')
const router = express.Router();
const ArticleModel = require('../model/ArticleModel');

//添加文章（包括精品课程、案列分析和活动概况的总体路由）
router.post('/add', (req, res) => {
    let { title, author, department, thumbnail, category, content, download_url } = req.body
    console.log("添加的文章内容", req.body)
    //判断上述字段都不能为空
    if (title && author && department && category && content) {
        ArticleModel.find({ title }).then((data) => {
            if (data.length === 0) {
                //文章不存在，可以添加
                return ArticleModel.insertMany({ title, author, department, thumbnail, category, content, download_url })
            } else {
                res.send({ err: -3, msg: '文章已经存在' })
            }
        }).then(() => {
            res.send({ err: 0, msg: '添加文章成功' })
        }).catch((err) => {
            res.send({ err: -2, msg: '添加文章失败', err })
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
//获取各个单位新闻列表（首页）
router.post('/news', (req, res) => {
    console.log(req.body)
    let { department } = req.body
    console.log(department)
    ArticleModel.find({ "category": '活动概况' }).find({ thumbnail: { $exists: true, $ne: [] } }).find({ "department": department }).sort({ date_time: -1 }).limit(2)
        .then((data) => {
            console.log(data)
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
    ArticleModel.find().sort({ date_time: -1 }).limit(Number(pageSize)).skip(Number((pageNumber - 1) * pageSize))
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

//获取文章分页列表
router.get('/checkedlist', (req, res) => {
    const { pageNum, pageSize } = req.query
    ArticleModel.find().sort({ date_time: -1 })
        .then(articles => { res.send({ status: 0, data: pageFilter(articles, pageNum, pageSize) }) })
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
    ArticleModel.find(contition).find().sort({ date_time: -1 })
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

module.exports = router