const mongoose = require('mongoose');

// comments by user stored in databases

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true
        },
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "user",
        //     required: true
        // },

        user: {
            type: String
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }


    }
)

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;