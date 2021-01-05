//这是一个文章的Model(包括强军阶梯的所有内容：精品课程、案例分析和活动概况)
const mongoose = require('mongoose');
var moment = require('moment')
moment.locale('zh-cn')

var QuantizationSchema = mongoose.Schema({
    name: { type: String, required: true },//评比的单位
    season1: { type: String, default: '' },//一季度成绩
    season2: { type: String, default: '' },//二季度成绩
    season3: { type: String, default: '' },//三季度成绩
    season4: { type: String, default: '' },//四季度成绩
    // time: { type: String, default: function () { return moment().format('L') } }, //前端显示的string类型的日期
    // date_time: { type: Date, default: Date.now },//后台用来排序的时间
});
var QuantizationModel = mongoose.model('quantization', QuantizationSchema)

module.exports = QuantizationModel