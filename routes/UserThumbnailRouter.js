const express = require('express')
const router = express.Router();
const fs = require('fs')
const multer = require('multer')
const uuidv4 = require('uuid').v4

const DIR = './public/asset/userThumbnail';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },//file 을 받아와서 DIR 경로에 저장한다.
    filename: (req, file, cb) => {// 저장할 파일의 이름을 설정한다.
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        console.log('[MULTER]: file.originalname :>> ', file.originalname);
        console.log('[MULTER]: fileName :>> ', fileName);
        const saveFileName = uuidv4() + '-' + fileName;
        console.log('[MULTER]: saveFileName :>> ', saveFileName);
        cb(null, saveFileName)
      // (uuidv4 O) 7c7c98c7-1d46-4305-ba3c-f2dc305e16b0-통지서
      // (uuidv4 X) 통지서
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {// 말 그대로 fileFilter
        if(file.mimetype == "image/png" 
           || file.mimetype == "image/jpg" 
           || file.mimetype == "image/jpeg"){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/user-thumbnail', upload.single('userThumbnail'), function(req, res) {
  if (!req.user) {
    return res.json({"err": "try to upload while not logged in"})
  }

  const User = require('../models/User')
  const url = "" 
              //+ req.protocol + '://' + req.get('host')
              + '/asset/userThumbnail/' + req.file.filename;


  User.findOneAndUpdate(
    {_id: req.user._id},
    {thumbnailUrl: url},
    {upsert: true},
    (err, doc) => {
      if (err) return res.json(err);
      console.log(`user thumbnail update succeeded`)
      return res.redirect(req.get('referer'));
    }
  )
});

module.exports = router;