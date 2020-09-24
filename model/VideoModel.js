const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var VideoSchema = new mongoose.Schema({
    name: { type: String, required: true },//视频名称
    time: { type: String, default: moment().format('LL') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },//后端用来排序等的时间
    url: { type: Array, required: true },//链接地址
    attr: { type: String, required: true },//所属属性，例如：言情，动作，恐怖等
    language: { type: String, required: true },
    main_actor: { type: String, required: true },
    director: { type: String, required: true },
    desc: { type: String, required: true },//视频的描述
});

var VideoModel = mongoose.model('videos', VideoSchema);



module.exports = VideoModel