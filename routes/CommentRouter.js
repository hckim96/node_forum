const express = require('express')
const router = express.Router();
const Post = require('../models/Post')
const Comment = require('../models/Comment')

// APIs


router.post('/comment', (req,res) => {
  const {parent, body, parentModel} = req.body;
  console.log(`[POST] /comment: write comment: ${body}, parent: ${parentModel} `)

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

// [POST] /comment/:commentId
// edit comment
router.post('/comment/:comment_id', (req,res) => {
  const {comment_id} = req.params;
  const {body} = req.body;

  // body null check
  if (!body) {
    return res.json({"err" : "no body field"})
  }
  // logged in ?
  if (!req.isAuthenticated()) {
    return res.json({"err" : "not logged in"})
  }

  Comment.findOneAndUpdate(
    {_id: comment_id},
    {body: body},
    (err, doc) => {
      if (err) return res.json(err);
      // check user is the author of this comment
      if (!doc.author.equals(req.user?._id)) return res.json({"err": "user is not the author of this comment"})
      console.log(`comment(${comment_id}) updated  ${doc.body} -> ${body}`)
      res.redirect(req.get('referer') ?? '/')
    }
  )
})

// [DELETE] 
// delete comment
router.delete('/comment/:comment_id', (req, res) => {
  const {comment_id} = req.params;
  Comment.findOne(
    {_id: comment_id},
    (err, doc) => {
      if (err) return res.json(err);
      if (!doc) return res.json({"err": "no doc"})
      // check user is the author? (should use equals.. to compare)
      if (!doc.author.equals(req.user._id)) return res.json({"err": "user is not the author of this comment"})
      if (doc.commentList.length > 0) {
        // update deleted field to true
        doc.deleted = true;
        doc.save();
        console.log('comment.update(): deleted=true')
      } else {
        // just delete
        doc.remove();
        console.log('comment.remove()')
        

        // should remove this from parent,
        if (doc.parentModel == 'Comment') {
          // parent is comment
          // in comment, if i'm the last one, and the parent is deleted, then remove the parent,
          Comment.findOneAndUpdate(
            {_id: doc.parent},
            {$pull: {commentList: doc.id}},
            {new: true},
            (err, doc2, result) => {
              if (err || !doc2) {
                console.log(`err: ${err}`)
                console.log(`doc2: ${doc2}`)
                console.log(`result: ${result}`)
                return res.json({"err": "err || !doc2"})
              }
              console.log(`parent update, pull commentList`)
              console.log(`err: ${err}`)
              console.log(`doc2: ${doc2}`)
              console.log(`result: ${result}`)
              if (doc2.commentList.length == 0) {
                doc2.remove();
              } else {
                doc2.save()
              }
            }
          )
          
        } else {
          // parent is post
          Post.findOneAndUpdate(
            {_id: doc.parent},
            {$pull: {commentList: doc.id}},
            (err, doc, result) => {
              console.log(`parent update, pull commentList`)
              console.log(`err: ${err}`)
              console.log(`doc: ${doc}`)
              console.log(`result: ${result}`)
            }
          )
        }


      }
      res.redirect(req.get('referer'))
    }
  )
})


module.exports = router;