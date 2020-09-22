const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var NoticeSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    department: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    time: { type: String, default: moment().format('L') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },

});

var NoticeModel = mongoose.model('notice', NoticeSchema)

module.exports = NoticeModel