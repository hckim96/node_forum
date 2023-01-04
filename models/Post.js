const mongoose  = require("mongoose")
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

  // createdAt,
  // updatedAt,
  // likes
  // views
  // 
  // id: {
  //   type: String,
  //   unique   : true,
  //   trim: true,
  //   required : true,
  // },
  // password: {
  //   type    : String,
  //   trim    : true,
  //   required: true,
  // },
},
{ // options,,
  timestamps: true // this will create createdAt, updatedAt
}
)
postSchema.plugin(AutoIncrement, {inc_field: "id"}); // 1, 2, 3 ...

const Post = mongoose.model("Post", postSchema)

module.exports = Post