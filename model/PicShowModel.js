const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var PicShowSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    department: { type: String, required: true },
    pics: { type: Array, default: [] },
    time: { type: String, default: moment().format('L') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },
});
var PicShowModel = mongoose.model('picshow', PicShowSchema)

module.exports = PicShowModel