const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var MusicSchema = new mongoose.Schema({
    name: { type: String, required: true },//音乐名
    time: { type: String, default: moment().format('LL') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },//后端用来排序等的时间
    url: { type: Array, required: true },//链接地址
    actor:{type:String,required:true},
});

var MusicModel = mongoose.model('musics', MusicSchema);



module.exports = MusicModel