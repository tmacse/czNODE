//这是一个文章的Model(包括强军阶梯的所有内容：精品课程、案例分析和活动概况)
const mongoose = require('mongoose');
var moment = require('moment')
moment.locale('zh-cn')

var LeaderSchema = mongoose.Schema({
    leader: { type: String, required: true },//领导的名字
    adviser: { type: String, required: true },//参谋的名字
    time: { type: String, default: function () { return moment().format('L') } }, //前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },//后台用来排序的时间
});
var LeaderModel = mongoose.model('leader', LeaderSchema)

module.exports = LeaderModel