const express = require('express');
const Comment = require('../model/comment.model')


const router = express.Router();

// create or post for comments

router.post('/post-comment', async (req, res) => {
    try {

        const newComment = new Comment(req.body);
        await newComment.save();

        res.status(200).send(
            {
                message: "Comment posted successfully",
                comment: newComment
            }
        )

    } catch (error) {
        console.error("Error while posting comment", error);
        res.status(500).send({
            message: "Error while posting comment"
        })
    }


})

//get all comments counts

router.get('/total-comments', async (req, res) => {
    try {

        const totalComments = await Comment.countDocuments();
        res.status(200).send(
            {
                message: "Total comments counts are : ",
                totalComments: totalComments
            }
        )

    } catch (error) {
        console.error("Error while getting total comments counts", error);
        res.status(500).send({
            message: "Error While getting total comments count"

        })


    }
})

module.exports = router;