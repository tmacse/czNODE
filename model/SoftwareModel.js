const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var SoftwareSchema = new mongoose.Schema({
    name: { type: String, required: true },//软件名称
    time: { type: String, default: moment().format('LL') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },
    url:{type:Array,required:true},//链接地址
    platform:{type:String,required:true},//所属平台
    attr:{type:String,required:true},//所属属性，例如：浏览器，下载工具……
    downloadNumber:{type:Number,default:1}//下载量
});

var SoftwareModel = mongoose.model('softwares', SoftwareSchema);



module.exports = SoftwareModel