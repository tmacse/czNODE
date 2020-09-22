const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ArticleModel = require('../model/ArticleModel.js');

const dirPath = path.join(__dirname, '..', 'public/image/articles')

const storage = multer.diskStorage({
    destination:function (req,res,cb) {
        //指定文件路径
        cb(null, './public/image/articles/')
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
//新闻图片上传
router.post('/uploads',upload.single('article-img'),(req,res)=>{
    console.log(req.file)

    let { mimetype,name} = req.file
    console.log(req.file)
    let types = ['jpg','jpeg','png','gif'] //允许上传的图片类型
    let tmpType = mimetype.split("/")[1]
    console.log(tmpType)
    if (types.indexOf(tmpType)== -1){
         res.send({err:-2,msg:'媒体类型错误'})
    }else{
        // let file=req.file.
        let url = `/public/image/articles/${req.file.filename}`
        // ArticleModel.insertMany({url})
        res.send({status: 0,
            data: {
                name: req.file.filename,
                url: 'http://localhost:4000/public/image/articles/' + req.file.filename}
        
        })
    } 
})
//删除图片（banner图片）同时删除banner集合里的数据
router.post('/delete', (req, res) => {
    const { name } = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
        if (err) {
            console.log(err)
            res.send({
                status: 1,
                msg: '删除文件失败'
            })
        } else {
            url = path.join('/public/image/articles', name)
            console.log(url)
            res.send({status:0})
            
            
        }
    })
})
//获取图片地址(banner图片地址)
router.get('/getList',(req,res)=>{
    BannerPicModel.find().sort({date_time:-1}).limit(5).then((data)=>{
        res.send({status:0,msg:'ok',list:data})
    })
    
})


module.exports = router