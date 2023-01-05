const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const Post = require("../models/Post")

router.get('/', (req, res) => {
  let {page = 1, limit = 10, q} = req.query;

  if (page <= 0) {
    return res.redirect('/?page=1');
  }
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
  
  let day = ['일', '월', '화', '수', '목', '금', '토'];
  let today = new Date();
  //1번 포맷
  let dateFormat1 = today.getFullYear() + '년 ' + (today.getMonth()+1) + '월 '
    + today.getDate() + '일 ' + day[today.getDay()] + '요일 '
    + today.getHours() + '시 ' + today.getMinutes() + '분 '
    + today.getSeconds() + '초'
  console.log(`ip: ${ip}, ${dateFormat1}`)
  
  var searchFilter = {};
  if (q && q.length > 0) {
    searchFilter = {"title": {$regex: q}};
  }
  Post.count(searchFilter, (err, count) => {
    if (err) {
      res.json(err)
    } else {
      Post.find(searchFilter)
          .limit(limit)
          .skip((page - 1) * limit)
          .populate('author')
          .sort('-createdAt')
          .exec((err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.render('home', {
                posts: result,
                isLoggedIn: req.isAuthenticated(),
                userId: req.user?.id ,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
              });
            }
          })
    }
  })
})

module.exports = router;