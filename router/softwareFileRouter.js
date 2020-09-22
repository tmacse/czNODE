const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const dirPath = path.join(__dirname, '..', 'public/software')

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        //指定文件路径
        cb(null, './public/software')
    },
    filename: function (req, file, cb) {

        console.log(file)
        //获取原来的后缀名,以最后一个.为分隔符
        let origin = file.originalname.split('.')
        let origins = origin[origin.length - 1]
        //获取当前时间的时间戳+随机数，确保唯一
        let tempname = (new Date()).getTime() + parseInt(Math.random() * 9999)
        cb(null, `${tempname}.${origins}`);
    },



});
var upload = multer({ storage: storage })

//软件上传
router.post('/uploads', upload.single('software'), (req, res) => {
    let { mimetype, path } = req.file
    let types = ['exe', 'rar', 'zip', 'msi'] //允许上传的软件类型
    let tmpType = mimetype.split("/")[1]
    console.log(tmpType)
    if (types.indexOf(tmpType) == -1) {
        res.send({ err: -2, msg: '媒体类型错误' })
    } else {
        let file = req.file
        let url = `/public/software/${req.file.filename}`
        // ArticleModel.insertMany({url})
        res.send({
            status: 0,
            data: {
                name: file.filename,
                url: BASE_URL_ADDRESS+ '/public/software/' + file.filename
            }

        })
    }
})
//删除软件
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
            url = path.join('/public/software', name)
            console.log(url)
            res.send({ status: 0 })

        }
    })
})
router.get('/download/', (req, res) => {
   let file= req.query.name[0]
   console.log(file)
//    let name = file.join()
//    let url = path.join(dirPath,file)
      res.download(`public/software/${file}`) })
    

module.exports = router