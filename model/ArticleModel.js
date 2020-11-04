//这是一个文章的Model(包括强军阶梯的所有内容：精品课程、案例分析和活动概况)
const mongoose = require('mongoose');
var moment = require('moment')
moment.locale('zh-cn')

var ArticleSchema = mongoose.Schema({
    title: { type: String, required: true },//文章（课程、公告等）的标题
    author: { type: String, required: true },//文章发布的作者
    department: { type: String, required: true },//文章发布的单位
    thumbnail: { type: Array, default: [] },//文章发布的缩略图，可以为空（只有活动概况才有缩略图）
    content: { type: String },//文章的内容
    download_url: { type: Array },//精品课程的下载地址(数组)
    category: { type: String, required: true },//分类：包括：1、精品课程；2、案例分析；3、活动概况
    time: { type: String, default: function () { return moment().format('L') } }, //前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },//后台用来排序的时间
});
var ArticleModel = mongoose.model('article', ArticleSchema)

module.exports = ArticleModel