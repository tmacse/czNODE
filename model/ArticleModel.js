const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    },
    content: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: function() {
            return moment().format('L')
        }
    }, //前端显示的string类型的日期
    date_time: {
        type: Date,
        default: Date.now
    },
    ischecked: {
        type: Boolean,
        default: false
    },
    isToped: {
        type: Boolean,
        default: false
    },

});
var ArticleModel = mongoose.model('article', ArticleSchema)

module.exports = ArticleModel