import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    image: {
        filename: String,
        data: Buffer,
        contentType: String,
      },
})

const User = mongoose.model('User', UserSchema);

export default User;