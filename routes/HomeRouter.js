const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const Post = require("../models/Post")

router.get('/', (req, res) => {
  Post.find().populate('author').exec((err, posts) => {
    if (err) {
      res.json(err);
    } else {
      // console.log(posts);
      res.render('home', {posts: posts, isLoggedIn: req.isAuthenticated(), userId: req.user?.id });
    }
  })

})

module.exports = router;