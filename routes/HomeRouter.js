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
  var cur_date = new Date();
  var utc = cur_date.getTime() + (cur_date.getTimezoneOffset() * 60 * 1000);
  var time_diff = 9 * 60 * 60 * 1000;
  var cur_date_korea = new Date(utc + (time_diff));

  //1번 포맷
  let dateFormat1 = cur_date_korea.getFullYear() + '년 ' + (cur_date_korea.getMonth()+1) + '월 '
    + cur_date_korea.getDate() + '일 ' + day[cur_date_korea.getDay()] + '요일 '
    + cur_date_korea.getHours() + '시 ' + cur_date_korea.getMinutes() + '분 '
    + cur_date_korea.getSeconds() + '초'
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
          .populate({
            path: 'commentList',
          })
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
                user: req.user,
              });
            }
          })
    }
  })
})

module.exports = router;