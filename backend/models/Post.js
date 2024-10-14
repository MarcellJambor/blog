import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    body: {
        type:String,
        required:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    date: {
        type:Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            text: { type: String, required: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        }
    ]
})

const Post = mongoose.model('Post', PostSchema);

export default Post;