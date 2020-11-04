const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var MailSchema = mongoose.Schema({
    leader: { type: String, required: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    department: { type: String },
    name: { type: String },
    ischecked: { type: Boolean, default: false },
    time: { type: String, default: function () { return moment().format('L') } }, //前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },
});
var MailModel = mongoose.model('mail', MailSchema)

module.exports = MailModel