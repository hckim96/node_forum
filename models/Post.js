const mongoose  = require("mongoose");
const Comment = require("./Comment");
const AutoIncrement  = require("mongoose-sequence")(mongoose)

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true,
  },
  body: {
    type: String,
    required : true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required : true,
  },
  id: {
    type : Number,
  }, 
  view: {
    type: Number,
  },
  commentList: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comment'
  }]
},
{ // options,,
  timestamps: true // this will create createdAt, updatedAt
}
)
postSchema.post("findOneAndDelete", async function (doc, next) {
  console.log(`postSchema.pre findOneAndDelete, doc: ${doc}`)
  // delete comment, comment of comment
  Comment.deleteMany(
    {$or:  [{_id: {$in: doc.commentList}}, {parent: {$in: doc.commentList}}]},
    (err, resp) => {
      console.log(`comment.deleteMany callback, err: ${err}, resp: ${JSON.stringify(resp)}`)
      if (!err) {
        console.log(`post delete cascade: comment.deleteMany succeeded`)
      }
    }
    )
  next();
})
postSchema.plugin(AutoIncrement, {inc_field: "id"}); // 1, 2, 3 ...

const Post = mongoose.model("Post", postSchema)

module.exports = Post