const express = require('express')
const router = express.Router();
const Post = require('../models/Post')
const Comment = require('../models/Comment')

// APIs


router.post('/comments', (req,res) => {
  const {parent, body, parentModel} = req.body;
  console.log(`[POST] /comments: write comment: ${body}, parent: ${parentModel} `)

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.get('referer');
    return res.redirect('/login')
  }
  if (!parent) {
    return res.json({"err": "!parent :", parent})
  }
  if (!body) {
    return res.json({"err": "!body :", body})
  }
  if (!parentModel) {
    return res.json({"err": "!parentModel :", parentModel})
  }


  // var comment = new Comment({

  // })
  var comment = new Comment(req.body);
  comment.author = req.user
  comment.save((err, info) => {
    if (err) {
      res.json(err);
    } else {
      if (parentModel == 'Post') {
        Post.findOneAndUpdate(
          {_id: parent}, 
          {$addToSet: {commentList: comment}},
          (err, doc) => {
            if (err) return res.json(err);
            console.log(`comment is saved and comment is added to post`)
            res.redirect(req.get('referer'))
          }
        )
      } else {
        Comment.findOneAndUpdate(
          {_id: parent}, 
          {$addToSet: {commentList: comment}},
          (err, doc) => {
            if (err) return res.json(err);
            res.redirect(req.get('referer'))
          }
        )
      }
    }
  });
})

// get comments of a post
// router.get('/comments/:postId', (req, res) => {
//   const {postId} = req.query;

//   if (!postId) {
//     res.json({"err": "!postId" + postId});
//   } else {

//   }
//   // let {page = 1, limit = 10, q} = req.query;
// })

// get comments of a comment



// create comment , to parentParent, parentComment
// router.post('/post/:postId', (req, res) => {
//   const {title, body} = req.body;

//   if (!title && !body) {
//     res.json({"err": "no fields"})
//     return;
//   }

//   Post.updateOne({id: req.params.postId}, {$set: {title: title, body: body}}, {timestamps: {createdAt: false}}, (err, resp) => {
//     if (err) {
//       res.json(err);
//     } else {
//       console.log('update succeded: ', resp);
//       res.redirect(`/post/${req.params.postId}`)
//     }
//   })
// })


module.exports = router;