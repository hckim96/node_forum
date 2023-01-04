const express = require('express')
const router = express.Router();
const Post = require('../models/Post')


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}
router.get('/write', isLoggedIn , (req, res) => {
  res.render('write')
})




// get posts
router.get('/post/:postId', (req, res) => {

  Post.findOne({id: req.params.postId}).populate('author').exec((err, post) => {
    if (err) {
      console.log(`err: ${err}`)
      res.redirect('/');
    } else {
      res.render('post', {post: post, isLoggedIn: req.isAuthenticated(), userId: req.user?.id})
    }
  })
})

// post  // edit post that has postId
router.post('/post/:postId', (req, res) => {
  const {title, body} = req.body;

  if (!title && !body) {
    res.json({"err": "no fields"})
    return;
  }

  Post.updateOne({id: req.params.postId}, {$set: {title: title, body: body}}, {timestamps: {createdAt: false}}, (err, resp) => {
    if (err) {
      res.json(err);
    } else {
      console.log('update succeded: ', resp);
      res.redirect(`/post/${req.params.postId}`)
    }
  })
})

router.delete('/post/:postId', (req, res) => {
  const {postId} = req.params;
  console.log(`[DELETE] /post/${postId}`);
  if (!postId) {
    res.json({"err": "DELETE /post no postId fields"});
    return;
  }

  Post.findOneAndDelete({id: postId}, (err, doc, resp) => {
    console.log("router.delete")
    console.log(err, doc, resp);
    if (!err) {
      console.log('delete succeeded')
      res.redirect('/');
    }
  })
})

// edit page
router.get('/edit/:postId', (req, res) => {
  Post.findOne({id: req.params.postId}).populate('author').exec((err, post) => {
    if (err || !req.isAuthenticated() || !req.user || !post || req.user.id != post.author.id) {
      console.log(`err: ${err}`)
      res.redirect('/');
    } else {
      res.render('editPost', {post: post, isLoggedIn: req.isAuthenticated(), userId: req.user?.id})
    }
  })
})


router.get('/post', (req, res) => {

  res.send('GET request to the homepage')
})
// get posts/:id
// post posts
// put posts/:id
// delete posts/:id

router.post('/post', function(req, res) {
  const { title, body } = req.body;
  console.log(`[POST] /write req.body = ${JSON.stringify(req.body)}, title = ${title}, body = ${body}`);
  var post = new Post(req.body);

  post.author = req.user._id;
  console.log(`post: ${post}`);

  post.save((err, info) => {
    if (!err) {
      console.log(`${info} saved..`);
      res.redirect(`/post/${info.id}`)
    } else {
      console.log(`err=${err}`)
      res.json({"err": err})
    }
  })
});


// update posts..
// get new title, new body,,




module.exports = router;