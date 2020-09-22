const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var DepartmentMessageSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    department: { type: String, required: true },
    content: { type: String },
    time: { type: String, default: moment().format('LL') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },
});
var DepartmentMessageModel = mongoose.model('departmentMessage', DepartmentMessageSchema)

module.exports = DepartmentMessageModel