const mongoose  = require("mongoose")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique   : true,
    trim: true,
    required : true,
  },
  password: {
    type    : String,
    trim    : true,
    required: true,
  },
},
{ // options,,
  timestamps: true // this will create createdAt, updatedAt fields
},
)

// error,,, isModified is not a function...
// userSchema.pre("save", async (next) => {
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);
  next();
})

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema)

module.exports = User