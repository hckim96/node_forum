const mongoose  = require("mongoose")
const AutoIncrement  = require("mongoose-sequence")(mongoose)

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required : true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required : true,
  },
  commentList: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comment',
  }],
  parent: {
    type: mongoose.Types.ObjectId,
    refPath: 'parentModel',
  },
  parentModel: {
    type: String,
    required: true,
    enum: ['Comment', 'Post']
  },
  deleted : {
    type: Boolean
  }
},
{ // options,,
  timestamps: true // this will create createdAt, updatedAt
}
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment