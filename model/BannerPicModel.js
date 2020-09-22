const mongoose = require('mongoose');

var moment = require('moment')
moment.locale('zh-cn')

var BannerPicSchema = new mongoose.Schema({
    time: { type: String, default: moment().format('LL') },//前端显示的string类型的日期
    date_time: { type: Date, default: Date.now },
    url: { type: Array, required: true },//链接图片地址
    url_address:{type:String,required:true}//图片链接到何处
});

var BannerPicModel = mongoose.model('bannerpics', BannerPicSchema);



module.exports = BannerPicModel