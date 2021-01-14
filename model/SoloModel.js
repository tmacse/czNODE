const mongoose = require('mongoose');
var moment = require('moment')
moment.locale('zh-cn')
//这是一个双争先进个人的评比
var SoloSchema = mongoose.Schema({
    name: { type: String, required: true },//评比的单位
    season1: { type: String, default: '' },//一季度评选的个人
    season2: { type: String, default: '' },//二季度评选的个人
    season3: { type: String, default: '' },//三季度评选的个人
    season4: { type: String, default: '' },//四季度评选的个人

});
var SoloModel = mongoose.model('solo', SoloSchema)

module.exports = SoloModel