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
  console.log(`ip: ${ip}`)
  
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