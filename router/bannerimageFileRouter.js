const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const BannerPicModel = require('../model/BannerPicModel.js');

const dirPath = path.join(__dirname, '..', 'public/image/banner')

const storage = multer.diskStorage({
    destination:function (req,res,cb) {
        //指定文件路径
        cb(null, './public/image/banner/')
    },
    filename:function (req,file,cb) {
        
        console.log(file)
        //获取原来的后缀名,以最后一个.为分隔符
        let origin = file.originalname.split('.')
        let origins = origin[origin.length-1]
        //获取当前时间的时间戳+随机数，确保唯一
        let tempname = (new Date()).getTime()+parseInt(Math.random()*9999)
        cb(null, `${tempname}.${origins}`);
    },
    
    
   
});
var upload = multer({ storage: storage })
//上传图片至banner文件夹，同时地址存储在banner集合里
router.post('/banneruploads',upload.single('banner-img'),(req,res)=>{
    let { mimetype,path} = req.file
    let types = ['jpg','jpeg','png','gif'] //允许上传的图片类型
    let tmpType = mimetype.split("/")[1]
    console.log(tmpType)
    if (types.indexOf(tmpType)== -1){
         res.send({err:-2,msg:'媒体类型错误'})
    }else{
        let file=req.file
        let url = `/public/image/banner/${req.file.filename}`
        BannerPicModel.insertMany({url})
        res.send({status: 0,
            data: {
                name: file.filename,
                url: BASE_URL_ADDRESS+'/public/image/banner/' + file.filename}
        
        })
    } 
})
//删除图片（banner图片）同时删除banner集合里的数据
router.post('/bannerdelete', (req, res) => {
    const { name } = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
        if (err) {
            console.log(err)
            res.send({
                status: 1,
                msg: '删除文件失败'
            })
        } else {
            url = path.join('/public/image/banner', name)
            console.log(url)
            BannerPicModel.deleteOne({ url: url }).then(res.send({
                status: 0
            }))
            
        }
    })
})
//获取图片地址(banner图片地址)
router.get('/getBannerList',(req,res)=>{
    BannerPicModel.find().sort({ date_time: -1}).limit(5).then((data)=>{
        res.send({status:0,msg:'ok',list:data})
    })
    
})


module.exports = router